import { Inject, Injectable } from '@nestjs/common';
import {
  DisplayAnalyzeProduct,
  DisplayProduct,
  Product,
  ProductFeature,
  ProductImage,
} from '@Domains/Product';
import { PrismaService } from '../../../prisma.service';
import { calculateAddedAndDeletedIds } from '../../utils/calculateAddedAndDeletedIds';
import { Prisma, PrismaClient } from '@prisma/client';
import { ReturnValueType } from '@Filters/customError';
import { Transactionable } from '../../utils/transactionable.interface';
import { nutritionFactField } from '../../utils/nutritionFactField';
import { Status } from '../../../domains/Status';

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
  glucoseValues?: number[];
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
    quantity: number | null;
    servingSize: number | null;
    calories: number | null;
    totalFat: number | null;
    saturatedFat: number | null;
    transFat: number | null;
    cholesterole: number | null;
    sodium: number | null;
    totalCarbohydrate: number | null;
    dietaryFiber: number | null;
    totalSugar: number | null;
    addedSugar: number | null;
    sugarAlcohol:number | null;
    protein: number | null;
    sweet: number | null;
    sour: number | null;
    salty: number | null;
    bitter: number | null;
    spicy: number | null;
    texture: string | null;
  };
}

interface UpdateProductsStatusArgs {
  isActive:boolean;
  skus:string[];
}

export interface ProductGeneralRepositoryInterface extends Transactionable{
  upsertProduct({
    activeStatus,
    preservationStyle,
    allergenLabel,
    ingredientLabel,
    expertComment,
    glucoseValues,
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

  updateProductsStatus({ isActive, skus }:UpdateProductsStatusArgs): Promise<ReturnValueType<Status>>;
}

@Injectable()
export class ProductGeneralRepository
implements ProductGeneralRepositoryInterface
{
  private originalPrismaClient : PrismaClient;
  constructor(@Inject(PrismaService) private prisma: PrismaClient | Prisma.TransactionClient) {}
  setPrismaClient(prisma: Prisma.TransactionClient): ProductGeneralRepositoryInterface {
    this.originalPrismaClient = this.prisma as PrismaClient;
    this.prisma = prisma;
    return this;
  }

  setDefaultPrismaClient() {
    this.prisma = this.originalPrismaClient;
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

    this.prisma.intermediateProductAllergen.deleteMany({
      where: {
        OR: allergensToDelete.map((productAllergenId) => {
          return { productAllergenId, productId };
        }),
      },
    });
    this.prisma.intermediateProductAllergen.createMany({
      data: allergensToAdd.map((productAllergenId) => {
        return { productAllergenId, productId };
      }),
    });

    const response = await this.prisma.intermediateProductAllergen.findMany({
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
  }
  async upsertProductFoodTypeSet({
    newProductFoodTypeIds,
    productId,
  }: UpsertProductFoodTypeSetArgs): Promise<ReturnValueType<ProductFeature[]>> {
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

    this.prisma.intermediateProductFoodType.deleteMany({
      where: {
        OR: foodTypeToDelete.map((productFoodTypeId) => {
          return { productFoodTypeId, productId };
        }),
      },
    });
    this.prisma.intermediateProductFoodType.createMany({
      data: foodTypeToAdd.map((productFoodTypeId) => {
        return { productFoodTypeId, productId };
      }),
    });

    const response = await this.prisma.intermediateProductFoodType.findMany({
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
  }
  async upsertProductCookingMethodSet({
    newProductCookingMethodIds,
    productId,
  }: UpsertProductCookingMethodSetArgs): Promise<ReturnValueType<ProductFeature[]>> {
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

    this.prisma.intermediateProductCookingMethod.deleteMany({
      where: {
        OR: cookingMethodToDelete.map((productCookingMethodId) => {
          return { productCookingMethodId, productId };
        }),
      },
    });
    this.prisma.intermediateProductCookingMethod.createMany({
      data: cookingMethodToAdd.map((productCookingMethodId) => {
        return { productCookingMethodId, productId };
      }),
    });

    const response = await this.prisma.intermediateProductCookingMethod.findMany({
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
  }

  async upsertProductIngredientSet({
    newProductIngredientIds,
    productId,
  }: UpsertProductIngredientSetArgs): Promise<ReturnValueType<ProductFeature[]>> {
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

    this.prisma.intermediateProductIngredient.deleteMany({
      where: {
        OR: ingredientsToDelete.map((productIngredientId) => {
          return { productIngredientId, productId };
        }),
      },
    });
    this.prisma.intermediateProductIngredient.createMany({
      data: ingredientsToAdd.map((productIngredientId) => {
        return { productIngredientId, productId };
      }),
    });

    const response = await this.prisma.intermediateProductIngredient.findMany({
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
  }

  async upsertProductImageSet({
    newProductImages,
    productId,
  }: UpsertProductImageSetArgs): Promise<ReturnValueType<ProductImage[]>> {
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
    this.prisma.productImage.deleteMany({
      where: {
        OR: imagesToDelete.map(({ src, position }) => {
          return { src, position };
        }),
      },
    });
    this.prisma.productImage.createMany({
      data: imagesToAdd.map(({ src, position }) => {
        return { src, position, productId };
      }),
    });
    const response = await this.prisma.productImage.findMany({
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
      await this.prisma.product.update({
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
  }

  async upsertProduct({
    activeStatus,
    preservationStyle,
    allergenLabel,
    ingredientLabel,
    expertComment,
    glucoseValues,
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
    const {
      quantity, servingSize, calories, totalFat, saturatedFat,
      transFat, cholesterole, sodium, totalCarbohydrate, dietaryFiber,
      totalSugar, addedSugar, sugarAlcohol, protein,
      sweet, sour, salty, bitter, spicy, texture,
    } = nutritionFact;
    const productNutritionInput: Prisma.ProductNutritionFactCreateWithoutProductInput =
      {
        quantity: quantity >=0? quantity : null,
        servingSize: servingSize >=0? servingSize : null,
        calories: calories >=0? calories : null,
        totalFatG: totalFat >=0? totalFat : null,
        saturatedFatG: saturatedFat >=0? saturatedFat : null,
        transFatG: transFat >=0? transFat : null,
        cholesteroleMg: cholesterole >=0? cholesterole : null,
        sodiumMg: sodium >=0? sodium : null,
        totalCarbohydrateG: totalCarbohydrate >=0? totalCarbohydrate : null,
        dietaryFiberG: dietaryFiber >=0? dietaryFiber : null,
        totalSugarG: totalSugar >=0? totalCarbohydrate : null,
        addedSugarG: addedSugar >=0? addedSugar : null,
        sugarAlcoholG: sugarAlcohol >=0? sugarAlcohol : null,
        proteinG: protein >=0? protein : null,
        sweet: sweet >=0? sweet : null,
        sour: sour >=0? sour : null,
        salty: salty >=0? salty : null,
        bitter: bitter >=0? bitter : null,
        spicy: spicy >=0? spicy : null,
        texture: texture || null,
      };

    const response = await this.prisma.product.upsert({
      where: { externalSku },
      create: {
        activeStatus,
        preservationStyle,
        allergenLabel,
        ingredientLabel,
        expertComment,
        glucoseValues,
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
        glucoseValues,
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
    const response = await this.prisma.product.findMany({
      where: {
        OR: products.map((product) => {
          return { externalSku: product.sku };
        }),
      },
      include: {
        productVendor: true,
        productImages: true,
        productNutritionFact: true,
      },
    });

    const displayProducts: DisplayProduct[] = response.map((product) => {
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
        nutritionFact: product?.productNutritionFact? nutritionFactField(product.productNutritionFact): null,
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
      include: {
        productVendor: true,
        productImages: true,
        productFlavor: true,
        productCategory: true,
        productNutritionFact: true,
        intermediateProductAllergens: { include: { productAllergen: true } },
        intermediateProductFoodTypes: { include: { productFoodType: true } },
        intermediateProductCookingMethods: { include: { productCookingMethod: true } },
        intermediateProductIngredients: { include: { productIngredient: true } },
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
          nutritionFact: product?.productNutritionFact? nutritionFactField(product.productNutritionFact): null,
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

  async updateProductsStatus({ isActive, skus }:UpdateProductsStatusArgs): Promise<ReturnValueType<Status>>{
    const response = await this.prisma.product.updateMany({
      where: { externalSku: { in: skus } },
      data: { activeStatus: isActive?'active':'inactive' },
    });

    if(!response){
      return [undefined, { name: 'updateProductStatus error', message: 'sku is invalid' }];
    }
    return [{ success: true }];
  }
}
