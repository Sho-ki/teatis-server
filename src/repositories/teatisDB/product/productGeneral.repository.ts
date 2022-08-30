import { Injectable } from '@nestjs/common';
import {
  DisplayAnalyzeProduct,
  DisplayProduct,
  Product,
  ProductFeature,
  ProductImage,
} from '@Domains/Product';
import { PrismaService } from '../../../prisma.service';
import { calculateAddedAndDeletedIds } from '../../utils/calculateAddedAndDeletedIds';
import { Prisma } from '@prisma/client';
import { ReturnValueType } from '@Filters/customError';
import { Transactionable } from '@Repositories/utils/transactionable.interface';

interface GetProductsBySkuArgs {
  products: Pick<Product, 'sku'>[];
}

interface GetAllProductsArgs {
  medicalConditions: { highBloodPressure: boolean, highCholesterol: boolean };
}

export interface GetOptionsArgs {
  target:
    | 'cookingMethod'
    | 'flavor'
    | 'allergen'
    | 'foodType'
    | 'ingredient'
    | 'category';
}

export interface GetExistingProductFeaturesArgs {
  productId: number;
}

export interface GetOption {
  id: number;
  name: string;
  label: string;
  src?: string | null;
}

interface UpsertProductIngredientSetArgs {
  productId: number;
  newProductIngredientIds: number[];
}

interface UpsertProductAllergenSetArgs {
  productId: number;
  newProductAllergenIds: number[];
}

interface UpsertProductFoodTypeSetArgs {
  productId: number;
  newProductFoodTypeIds: number[];
}

interface UpsertProductCookingMethodSetArgs {
  productId: number;
  newProductCookingMethodIds: number[];
}

interface UpsertProductImageSetArgs {
  productId: number;
  newProductImages: ProductImage[];
}

interface UpsertProductArgs {
  activeStatus: 'active' | 'inactive';
  preservationStyle: 'normal' | 'refrigerated' | 'frozen';
  allergenLabel?: string;
  ingredientLabel?: string;
  expertComment?: string;
  WSP?: number;
  MSP?: number;
  label: string;
  name: string;
  productProviderId: number;
  upcCode?: string;
  flavorId: number;
  categoryId: number;
  vendorId: number;
  externalSku: string;
  nutritionFact: {
    quantity?: number;
    servingSize?: number;
    calories?: number;
    totalFat?: number;
    saturatedFat?: number;
    transFat?: number;
    cholesterole?: number;
    sodium?: number;
    totalCarbohydrate?: number;
    dietaryFiber?: number;
    totalSugar?: number;
    addedSugar?: number;
    protein?: number;
    sweet?: number;
    sour?: number;
    salty?: number;
    bitter?: number;
    spicy?: number;
    texture?: string;
  };
}

export interface ProductGeneralRepositoryInterface extends Transactionable {
  upsertProduct({
    activeStatus,
    preservationStyle,
    allergenLabel,
    ingredientLabel,
    expertComment,
    WSP,
    MSP,
    label,
    name,
    productProviderId,
    upcCode,
    flavorId,
    categoryId,
    vendorId,
    externalSku,
    nutritionFact,
  }: UpsertProductArgs): Promise<ReturnValueType<Product>>;

  getProductsBySku({ products }: GetProductsBySkuArgs): Promise<ReturnValueType<DisplayProduct[]>>;
  getAllProducts({ medicalConditions }: GetAllProductsArgs): Promise<ReturnValueType<DisplayAnalyzeProduct[]>>;
  getOptions({ target }: GetOptionsArgs): Promise<ReturnValueType<ProductFeature[]>>;

  upsertProductIngredientSet({
    newProductIngredientIds,
    productId,
  }: UpsertProductIngredientSetArgs): Promise<ReturnValueType<ProductFeature[]>>;

  upsertProductAllergenSet({
    newProductAllergenIds,
    productId,
  }: UpsertProductAllergenSetArgs): Promise<ReturnValueType<ProductFeature[]>>;

  upsertProductFoodTypeSet({
    newProductFoodTypeIds,
    productId,
  }: UpsertProductFoodTypeSetArgs): Promise<ReturnValueType<ProductFeature[]>>;

  upsertProductCookingMethodSet({
    newProductCookingMethodIds,
    productId,
  }: UpsertProductCookingMethodSetArgs): Promise<ReturnValueType<ProductFeature[]>>;

  upsertProductImageSet({
    newProductImages,
    productId,
  }: UpsertProductImageSetArgs): Promise<ReturnValueType<ProductImage[]>>;

  performAtomicOperations<T>(transactionBlock: () => Promise<T>): Promise<T>;
}

@Injectable()
export class ProductGeneralRepository
implements ProductGeneralRepositoryInterface, Transactionable
{
  constructor(private prisma: PrismaService | Prisma.TransactionClient) {}
  private originalPrismaClient: PrismaService | Prisma.TransactionClient;

  setPrismaClient(prisma: Prisma.TransactionClient): ProductGeneralRepositoryInterface {
    this.originalPrismaClient = this.prisma;
    this.prisma = prisma;
    return this;
  }

  setDefaultPrismaClient() {
    this.prisma = this.originalPrismaClient;
  }

  performAtomicOperations<T>(transactionBlock: () => Promise<T>): Promise<T> {
    return (this.prisma as PrismaService).$transaction(transactionBlock);
  }

  private async getExistingProductIngredients({ productId }: GetExistingProductFeaturesArgs):
  Promise<ReturnValueType<ProductFeature[]>> {
    const response = await this.prisma.intermediateProductIngredient.findMany({
      where: { product: { id: productId } },
      select: { productIngredient: true },
    });

    return [
      response.map(({ productIngredient }): ProductFeature => {
        return {
          id: productIngredient.id,
          name: productIngredient.name,
          label: productIngredient.label,
        };
      }),
    ];
  }
  private async getExistingProductAllergens({ productId }: GetExistingProductFeaturesArgs):
  Promise<ReturnValueType<ProductFeature[]>> {
    const response = await this.prisma.intermediateProductAllergen.findMany({
      where: { product: { id: productId } },
      select: { productAllergen: true },
    });

    return [
      response.map(({ productAllergen }): ProductFeature => {
        return {
          id: productAllergen.id,
          name: productAllergen.name,
          label: productAllergen.label,
        };
      }),
    ];
  }
  private async getExistingProductCookingMethods({ productId }: GetExistingProductFeaturesArgs):
  Promise<ReturnValueType<ProductFeature[]>> {
    const response =
      await this.prisma.intermediateProductCookingMethod.findMany({
        where: { product: { id: productId } },
        select: { productCookingMethod: true },
      });

    return [
      response.map(({ productCookingMethod }): ProductFeature => {
        return {
          id: productCookingMethod.id,
          name: productCookingMethod.name,
          label: productCookingMethod.label,
        };
      }),
    ];
  }
  private async getExistingProductFoodTypes({ productId }: GetExistingProductFeaturesArgs):
  Promise<ReturnValueType<ProductFeature[]>> {
    const response = await this.prisma.intermediateProductFoodType.findMany({
      where: { product: { id: productId } },
      select: { productFoodType: true },
    });

    return [
      response.map(({ productFoodType }): ProductFeature => {
        return {
          id: productFoodType.id,
          name: productFoodType.name,
          label: productFoodType.label,
        };
      }),
    ];
  }
  private async getExistingProductImages({ productId }: GetExistingProductFeaturesArgs):
  Promise<ReturnValueType<ProductImage[]>> {
    const response = await this.prisma.productImage.findMany({
      where: { product: { id: productId } },
      select: {
        id: true,
        src: true,
        position: true,
      },
    });

    return [
      response.map(({ id, src, position }) => {
        return { id, src, position };
      }),
    ];
  }

  async upsertProductAllergenSet({
    newProductAllergenIds,
    productId,
  }: UpsertProductAllergenSetArgs): Promise<ReturnValueType<ProductFeature[]>> {
    return await (this.prisma as PrismaService).$transaction(async (prisma) => {
      const [existingProductAllergens, getExistingProductAllergensError] =
        await this.getExistingProductAllergens({ productId });
      if (getExistingProductAllergensError) {
        return [
          undefined,
          {
            name: 'Internal Server Error',
            message: 'Server Side Error: upsertProductAllergenSet failed',
          },
        ];
      }
      const existingProductAllergenIds = existingProductAllergens.map(
        ({ id }) => id,
      );
      const [allergensToAdd, allergensToDelete] = calculateAddedAndDeletedIds(
        existingProductAllergenIds,
        newProductAllergenIds,
      );

      await Promise.all([
        prisma.intermediateProductAllergen.deleteMany({
          where: {
            OR: allergensToDelete.map((productAllergenId) => {
              return { productAllergenId, productId };
            }),
          },
        }),
        prisma.intermediateProductAllergen.createMany({
          data: allergensToAdd.map((productAllergenId) => {
            return { productAllergenId, productId };
          }),
        }),
      ]);

      const response = await prisma.intermediateProductAllergen.findMany({
        where: { productId },
        select: { productAllergen: true },
      });
      return [
        response.map(({ productAllergen }) => {
          return {
            id: productAllergen.id,
            label: productAllergen.label,
            name: productAllergen.name,
          };
        }),
      ];
    });
  }
  async upsertProductFoodTypeSet({
    newProductFoodTypeIds,
    productId,
  }: UpsertProductFoodTypeSetArgs): Promise<ReturnValueType<ProductFeature[]>> {
    return await (this.prisma as PrismaService).$transaction(async (prisma) => {
      const [existingProductFoodTypes, getExistingProductFoodTypesError] =
        await this.getExistingProductFoodTypes({ productId });
      if (getExistingProductFoodTypesError) {
        return [
          undefined,
          {
            name: 'Internal Server Error',
            message: 'Server Side Error: getExistingProductFoodTypes failed',
          },
        ];
      }

      const existingProductFoodTypeIds = existingProductFoodTypes.map(
        ({ id }) => id,
      );
      const [foodTypeToAdd, foodTypeToDelete] = calculateAddedAndDeletedIds(
        existingProductFoodTypeIds,
        newProductFoodTypeIds,
      );

      await Promise.all([
        prisma.intermediateProductFoodType.deleteMany({
          where: {
            OR: foodTypeToDelete.map((productFoodTypeId) => {
              return { productFoodTypeId, productId };
            }),
          },
        }),
        prisma.intermediateProductFoodType.createMany({
          data: foodTypeToAdd.map((productFoodTypeId) => {
            return { productFoodTypeId, productId };
          }),
        }),
      ]);

      const response = await prisma.intermediateProductFoodType.findMany({
        where: { productId },
        select: { productFoodType: true },
      });
      return [
        response.map(({ productFoodType }) => {
          return {
            id: productFoodType.id,
            label: productFoodType.label,
            name: productFoodType.name,
          };
        }),
      ];
    });
  }
  async upsertProductCookingMethodSet({
    newProductCookingMethodIds,
    productId,
  }: UpsertProductCookingMethodSetArgs): Promise<ReturnValueType<ProductFeature[]>> {
    return await (this.prisma as PrismaService).$transaction(async (prisma) => {
      const [existingProductCookingMethods, getExistingProductCookingMethodsError] =
      await this.getExistingProductCookingMethods({ productId });
      if (getExistingProductCookingMethodsError) {
        return [
          undefined,
          {
            name: 'Internal Server Error',
            message:
              'Server Side Error: getExistingProductCookingMethods failed',
          },
        ];
      }

      const existingProductCookingMethodIds = existingProductCookingMethods.map(
        ({ id }) => id,
      );
      const [cookingMethodToAdd, cookingMethodToDelete] =
        calculateAddedAndDeletedIds(
          existingProductCookingMethodIds,
          newProductCookingMethodIds,
        );

      await Promise.all([
        prisma.intermediateProductCookingMethod.deleteMany({
          where: {
            OR: cookingMethodToDelete.map((productCookingMethodId) => {
              return { productCookingMethodId, productId };
            }),
          },
        }),
        prisma.intermediateProductCookingMethod.createMany({
          data: cookingMethodToAdd.map((productCookingMethodId) => {
            return { productCookingMethodId, productId };
          }),
        }),
      ]);

      const response = await prisma.intermediateProductCookingMethod.findMany({
        where: { productId },
        select: { productCookingMethod: true },
      });
      return [
        response.map(({ productCookingMethod }) => {
          return {
            id: productCookingMethod.id,
            label: productCookingMethod.label,
            name: productCookingMethod.name,
          };
        }),
      ];
    });
  }

  async upsertProductIngredientSet({
    newProductIngredientIds,
    productId,
  }: UpsertProductIngredientSetArgs): Promise<ReturnValueType<ProductFeature[]>> {
    return await (this.prisma as PrismaService).$transaction(async (prisma) => {
      const [existingProductIngredients, getExistingProductIngredientsError] =
        await this.getExistingProductIngredients({ productId });
      if (getExistingProductIngredientsError) {
        return [
          undefined,
          {
            name: 'Internal Server Error',
            message: 'Server Side Error: getExistingProductIngredients failed',
          },
        ];
      }
      const existingProductIngredientIds = existingProductIngredients.map(
        ({ id }) => id,
      );
      const [ingredientsToAdd, ingredientsToDelete] =
        calculateAddedAndDeletedIds(
          existingProductIngredientIds,
          newProductIngredientIds,
        );

      await Promise.all([
        prisma.intermediateProductIngredient.deleteMany({
          where: {
            OR: ingredientsToDelete.map((productIngredientId) => {
              return { productIngredientId, productId };
            }),
          },
        }),
        prisma.intermediateProductIngredient.createMany({
          data: ingredientsToAdd.map((productIngredientId) => {
            return { productIngredientId, productId };
          }),
        }),
      ]);

      const response = await prisma.intermediateProductIngredient.findMany({
        where: { productId },
        select: { productIngredient: true },
      });
      return [
        response.map(({ productIngredient }) => {
          return {
            id: productIngredient.id,
            label: productIngredient.label,
            name: productIngredient.name,
          };
        }),
      ];
    });
  }

  async upsertProductImageSet({
    newProductImages,
    productId,
  }: UpsertProductImageSetArgs): Promise<ReturnValueType<ProductImage[]>> {
    return await (this.prisma as PrismaService).$transaction(async (prisma) => {
      const [existingProductImages, getExistingProductImagesError] =
        await this.getExistingProductImages({ productId });
      if (getExistingProductImagesError) {
        return [
          undefined,
          {
            name: 'Internal Server Error',
            message: 'Server Side Error: getExistingProductImages failed',
          },
        ];
      }

      const existingImageSet = new Set(
        existingProductImages.map(({ src, position }) => {
          return JSON.stringify({ src, position });
        }),
      );
      const newImageSet = new Set(
        newProductImages.map(({ src, position }) => {
          return JSON.stringify({ src, position });
        }),
      );

      const imagesToDelete = existingProductImages.filter(
        ({ src, position }) => {
          return !newImageSet.has(JSON.stringify({ src, position }));
        },
      );

      const imagesToAdd = newProductImages.filter(
        ({ src, position }) =>
          !existingImageSet.has(JSON.stringify({ src, position })),
      );
      await Promise.all([
        prisma.productImage.deleteMany({
          where: {
            OR: imagesToDelete.map(({ src, position }) => {
              return { src, position };
            }),
          },
        }),
        prisma.productImage.createMany({
          data: imagesToAdd.map(({ src, position }) => {
            return { src, position, productId };
          }),
        }),
      ]);
      const response = await prisma.productImage.findMany({
        where: { productId },
        select: {
          id: true,
          src: true,
          position: true,
          product: { select: { mainProductImageId: true } },
        },
      });

      const currentMainProductImageId =
        response[0]?.product?.mainProductImageId;
      const newMainProductImage = response.find(
        ({ position }) => position === 1,
      );
      if (newMainProductImage?.id !== currentMainProductImageId) {
        await prisma.product.update({
          where: { id: productId },
          data: { mainProductImageId: newMainProductImage.id },
        });
      }

      return [
        response.map(({ id, src, position }) => {
          return {
            id,
            src,
            position,
          };
        }),
      ];
    });
  }

  async upsertProduct({
    activeStatus,
    preservationStyle,
    allergenLabel,
    ingredientLabel,
    expertComment,
    WSP,
    MSP,
    label,
    name,
    productProviderId,
    upcCode,
    flavorId,
    categoryId,
    vendorId,
    externalSku,
    nutritionFact,
  }: UpsertProductArgs): Promise<ReturnValueType<Product>> {
    const productNutritionInput: Prisma.ProductNutritionFactCreateWithoutProductInput =
      {
        quantity: nutritionFact.quantity,
        servingSize: nutritionFact.servingSize,
        calories: nutritionFact.calories,
        totalFatG: nutritionFact.totalFat,
        saturatedFatG: nutritionFact.saturatedFat,
        transFatG: nutritionFact.transFat,
        cholesteroleMg: nutritionFact.cholesterole,
        sodiumMg: nutritionFact.sodium,
        totalCarbohydrateG: nutritionFact.totalCarbohydrate,
        dietaryFiberG: nutritionFact.dietaryFiber,
        totalSugarG: nutritionFact.totalSugar,
        addedSugarG: nutritionFact.addedSugar,
        proteinG: nutritionFact.protein,
        sweet: nutritionFact.sweet,
        sour: nutritionFact.sour,
        salty: nutritionFact.salty,
        bitter: nutritionFact.bitter,
        spicy: nutritionFact.spicy,
        texture: nutritionFact.texture,
      };

    const response = await this.prisma.product.upsert({
      where: { externalSku },
      create: {
        activeStatus,
        preservationStyle,
        allergenLabel,
        ingredientLabel,
        expertComment,
        WSP,
        MSP,
        label,
        name,
        productProviderId,
        upcCode,
        productFlavorId: flavorId,
        productCategoryId: categoryId,
        productVendorId: vendorId,
        externalSku,
        productNutritionFact: { create: productNutritionInput },
      },
      update: {
        activeStatus,
        preservationStyle,
        allergenLabel,
        ingredientLabel,
        expertComment,
        WSP,
        MSP,
        label,
        name,
        productProviderId,
        upcCode,
        productFlavorId: flavorId,
        productCategoryId: categoryId,
        productVendorId: vendorId,
        externalSku,
        productNutritionFact: {
          upsert: {
            create: productNutritionInput,
            update: productNutritionInput,
          },
        },
      },
      select: {
        id: true,
        externalSku: true,
        name: true,
        label: true,
        mainProductImageId: true,
        productImages: true,
      },
    });

    const {
      id,
      externalSku: sku,
      name: productName,
      label: productLabel,
    } = response;

    return [{ id, sku, name: productName, label: productLabel }];
  }
  async getProductsBySku({ products }: GetProductsBySkuArgs): Promise<ReturnValueType<DisplayProduct[]>> {
    const res = await this.prisma.product.findMany({
      where: {
        OR: products.map((product) => {
          return { externalSku: product.sku };
        }),
      },
      select: {
        id: true,
        productVendor: { select: { label: true } },
        externalSku: true,
        productImages: { select: { id: true, src: true, position: true } },
        expertComment: true,
        label: true,
        name: true,
        productNutritionFact: true,
        ingredientLabel: true,
        allergenLabel: true,
      },
    });

    const displayProducts: DisplayProduct[] = res.map((product) => {
      return {
        id: product.id,
        sku: product.externalSku,
        images: product.productImages,
        vendor: product?.productVendor?.label || '',
        label: product.label || '',
        expertComment: product.expertComment || '',
        name: product.name,
        ingredientLabel: product.ingredientLabel,
        allergenLabel: product.allergenLabel,
        nutritionFact: {
          calorie: product.productNutritionFact.calories,
          totalFat: product.productNutritionFact.totalFatG,
          saturatedFat: product.productNutritionFact.saturatedFatG,
          transFat: product.productNutritionFact.transFatG,
          cholesterole: product.productNutritionFact.cholesteroleMg,
          sodium: product.productNutritionFact.sodiumMg,
          totalCarbohydrate: product.productNutritionFact.totalCarbohydrateG,
          dietaryFiber: product.productNutritionFact.dietaryFiberG,
          totalSugar: product.productNutritionFact.totalSugarG,
          addedSugar: product.productNutritionFact.addedSugarG,
          protein: product.productNutritionFact.proteinG,
        },
      };
    });
    return [displayProducts];
  }

  async getAllProducts({ medicalConditions }: GetAllProductsArgs): Promise<ReturnValueType<DisplayAnalyzeProduct[]>> {
    const res = await this.prisma.product.findMany({
      where: {
        productCategory: { activeStatus: 'active' },
        activeStatus: 'active',
        productNutritionFact: medicalConditions.highBloodPressure
          ? { sodiumMg: { lt: 500 } }
          : {},
      },
      select: {
        id: true,
        name: true,
        label: true,
        externalSku: true,
        productVendor: { select: { label: true, id: true } },
        productImages: { select: { id: true, position: true, src: true } },
        productFlavor: { select: { id: true, name: true, label: true } },
        productCategory: { select: { id: true, name: true, label: true } },
        expertComment: true,
        allergenLabel: true,
        ingredientLabel: true,
        productNutritionFact: {
          select: {
            calories: true,
            totalFatG: true,
            saturatedFatG: true,
            transFatG: true,
            cholesteroleMg: true,
            sodiumMg: true,
            totalCarbohydrateG: true,
            dietaryFiberG: true,
            totalSugarG: true,
            addedSugarG: true,
            proteinG: true,
          },
        },
        intermediateProductAllergens:
        { select: { productAllergen: { select: { id: true, name: true, label: true } } } },
        intermediateProductFoodTypes:
        { select: { productFoodType: { select: { id: true, name: true, label: true } } } },
        intermediateProductCookingMethods:
        { select: { productCookingMethod: { select: { id: true, name: true, label: true } } } },
        intermediateProductIngredients:
        { select: { productIngredient: { select: { id: true, name: true, label: true } } } },
      },
    });

    return [
      res.map((product) => {
        return {
          id: product.id,
          name: product?.name || '',
          expertComment: product?.expertComment || '',
          label: product?.label || '',
          ingredientLabel: product?.ingredientLabel || '',
          allergenLabel: product?.allergenLabel || '',
          sku: product.externalSku,
          vendor: product?.productVendor?.id
            ? {
              id: product.productVendor.id,
              label: product.productVendor.label,
            }
            : {},
          images: product?.productImages
            ? product.productImages.map((image): ProductImage => {
              return {
                id: image.id,
                position: image.position,
                src: image.src,
              };
            })
            : [],
          flavor: product?.productFlavor?.id
            ? {
              id: product.productFlavor.id,
              name: product.productFlavor.name,
              label: product.productFlavor.label,
            }
            : {},
          category: product?.productCategory?.id
            ? {
              id: product.productCategory.id,
              name: product.productCategory.name,
              label: product.productCategory.label,
            }
            : {},
          allergens:
            product.intermediateProductAllergens?.length > 0
              ? product.intermediateProductAllergens.map(
                (allergen): ProductFeature => {
                  return {
                    id: allergen.productAllergen.id,
                    name: allergen.productAllergen.name,
                    label: allergen.productAllergen.label,
                  };
                },
              )
              : [],
          foodTypes:
            product.intermediateProductFoodTypes?.length > 0
              ? product.intermediateProductFoodTypes.map(
                (foodType): ProductFeature => {
                  return {
                    id: foodType.productFoodType.id,
                    name: foodType.productFoodType.name,
                    label: foodType.productFoodType.label,
                  };
                },
              )
              : [],
          cookingMethods:
            product.intermediateProductCookingMethods?.length > 0
              ? product.intermediateProductCookingMethods.map(
                (cookingMethod): ProductFeature => {
                  return {
                    id: cookingMethod.productCookingMethod.id,
                    name: cookingMethod.productCookingMethod.name,
                    label: cookingMethod.productCookingMethod.label,
                  };
                },
              )
              : [],
          ingredients:
            product.intermediateProductIngredients?.length > 0
              ? product.intermediateProductIngredients.map(
                (ingredient): ProductFeature => {
                  return {
                    id: ingredient.productIngredient.id,
                    name: ingredient.productIngredient.name,
                    label: ingredient.productIngredient.label,
                  };
                },
              )
              : [],
          nutritionFact: {
            calorie: product?.productNutritionFact?.calories || 0,
            totalFat: product?.productNutritionFact?.totalFatG || 0,
            saturatedFat: product?.productNutritionFact?.saturatedFatG || 0,
            transFat: product?.productNutritionFact?.transFatG || 0,
            cholesterole: product?.productNutritionFact?.cholesteroleMg || 0,
            sodium: product?.productNutritionFact?.sodiumMg || 0,
            totalCarbohydrate:
              product?.productNutritionFact?.totalCarbohydrateG || 0,
            dietaryFiber: product?.productNutritionFact?.dietaryFiberG || 0,
            totalSugar: product?.productNutritionFact?.totalSugarG || 0,
            addedSugar: product?.productNutritionFact?.addedSugarG || 0,
            protein: product?.productNutritionFact?.proteinG || 0,
          },
        };
      }),
    ];
  }

  async getOptions({ target }: GetOptionsArgs): Promise<ReturnValueType<ProductFeature[]>> {
    let getOptionsRes: ProductFeature[] = [];
    switch (target) {
      case 'cookingMethod':
        getOptionsRes = await this.prisma.productCookingMethod.findMany({
          select:
          { id: true, name: true, label: true },
        });
        break;
      case 'flavor':
        getOptionsRes = await this.prisma.productFlavor.findMany({ select: { id: true, name: true, label: true } });
        break;
      case 'category':
        getOptionsRes = await this.prisma.productCategory.findMany({
          where: { activeStatus: 'active' },
          select:
          { id: true, name: true, label: true, src: true },
        });

        break;
      case 'foodType':
        getOptionsRes = await this.prisma.productFoodType.findMany({ select: { id: true, name: true, label: true } });
        break;
      case 'allergen':
        getOptionsRes = await this.prisma.productAllergen.findMany({ select: { id: true, name: true, label: true } });

        break;
      case 'ingredient':
        getOptionsRes = await this.prisma.productIngredient.findMany(
          { where: { parentIngredientId: null }, select: { id: true, name: true, label: true } });
        break;
      default:
        break;
    }

    return [getOptionsRes];
  }
}
