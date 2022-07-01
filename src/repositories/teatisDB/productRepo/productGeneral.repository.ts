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

interface GetProductsBySkuArgs {
  products: Pick<Product, 'sku'>[];
}

interface GetAllProductsArgs {
  medicalCondtions: { highBloodPressure: boolean; highCholesterol: boolean };
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

export interface GetExsitingProductFeaturesArgs {
  productId: number;
}

export interface GetOption {
  id: number;
  name: string;
  label: string;
  src?: string | null;
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

export interface ProductGeneralRepoInterface {
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
  }: UpsertProductArgs): Promise<[Product?, Error?]>;

  getProductsBySku({
    products,
  }: GetProductsBySkuArgs): Promise<[DisplayProduct[]?, Error?]>;
  getAllProducts({
    medicalCondtions,
  }: GetAllProductsArgs): Promise<[DisplayAnalyzeProduct[]?, Error?]>;
  getOptions({ target }: GetOptionsArgs): Promise<[ProductFeature[]?, Error?]>;

  upsertProductIngredientSet(
    newProductIngredientIds: number[],
    productId: number,
  ): Promise<[ProductFeature[]?, Error?]>;

  upsertProductAllergenSet(
    newProductAllergenIds: number[],
    productId: number,
  ): Promise<[ProductFeature[]?, Error?]>;

  upsertProductFoodTypeSet(
    newProductFoodTypeIds: number[],
    productId: number,
  ): Promise<[ProductFeature[]?, Error?]>;

  upsertProductCookingMethodSet(
    newProductCookingMethodIds: number[],
    productId: number,
  ): Promise<[ProductFeature[]?, Error?]>;

  upsertProductImageSet(
    newProductImages: ProductImage[],
    productId: number,
  ): Promise<[ProductImage[]?, Error?]>;
}

@Injectable()
export class ProductGeneralRepo implements ProductGeneralRepoInterface {
  constructor(private prisma: PrismaService) {}
  private async getExistingProductIngredients({
    productId,
  }: GetExsitingProductFeaturesArgs): Promise<[ProductFeature[]?, Error?]> {
    try {
      const response = await this.prisma.intermediateProductIngredient.findMany(
        {
          where: {
            product: { id: productId },
          },
          select: {
            productIngredient: true,
          },
        },
      );
      if (!response) {
        throw new Error();
      }

      return [
        response.map(({ productIngredient }): ProductFeature => {
          return {
            id: productIngredient.id,
            name: productIngredient.name,
            label: productIngredient.label,
          };
        }),
      ];
    } catch (e) {
      return [
        undefined,
        {
          name: 'Internal Server Error',
          message: 'Server Side Error: getExistingProductIngredients failed',
        },
      ];
    }
  }
  private async getExistingProductAllergens({
    productId,
  }: GetExsitingProductFeaturesArgs): Promise<[ProductFeature[]?, Error?]> {
    try {
      const response = await this.prisma.intermediateProductAllergen.findMany({
        where: {
          product: { id: productId },
        },
        select: {
          productAllergen: true,
        },
      });
      if (!response) {
        throw new Error();
      }

      return [
        response.map(({ productAllergen }): ProductFeature => {
          return {
            id: productAllergen.id,
            name: productAllergen.name,
            label: productAllergen.label,
          };
        }),
      ];
    } catch (e) {
      return [
        undefined,
        {
          name: 'Internal Server Error',
          message: 'Server Side Error: getExistingProductAllergens failed',
        },
      ];
    }
  }
  private async getExistingProductCookingMethods({
    productId,
  }: GetExsitingProductFeaturesArgs): Promise<[ProductFeature[]?, Error?]> {
    try {
      const response =
        await this.prisma.intermediateProductCookingMethod.findMany({
          where: {
            product: { id: productId },
          },
          select: {
            productCookingMethod: true,
          },
        });
      if (!response) {
        throw new Error();
      }

      return [
        response.map(({ productCookingMethod }): ProductFeature => {
          return {
            id: productCookingMethod.id,
            name: productCookingMethod.name,
            label: productCookingMethod.label,
          };
        }),
      ];
    } catch (e) {
      return [
        undefined,
        {
          name: 'Internal Server Error',
          message: 'Server Side Error: getExistingProductCookingMethods failed',
        },
      ];
    }
  }
  private async getExistingProductFoodTypes({
    productId,
  }: GetExsitingProductFeaturesArgs): Promise<[ProductFeature[]?, Error?]> {
    try {
      const response = await this.prisma.intermediateProductFoodType.findMany({
        where: {
          product: { id: productId },
        },
        select: {
          productFoodType: true,
        },
      });
      if (!response) {
        throw new Error();
      }

      return [
        response.map(({ productFoodType }): ProductFeature => {
          return {
            id: productFoodType.id,
            name: productFoodType.name,
            label: productFoodType.label,
          };
        }),
      ];
    } catch (e) {
      return [
        undefined,
        {
          name: 'Internal Server Error',
          message: 'Server Side Error: getExistingProductFoodTypes failed',
        },
      ];
    }
  }
  private async getExistingProductImages({
    productId,
  }: GetExsitingProductFeaturesArgs): Promise<[ProductImage[]?, Error?]> {
    try {
      const response = await this.prisma.productImage.findMany({
        where: {
          product: { id: productId },
        },
        select: {
          id: true,
          src: true,
          position: true,
        },
      });
      if (!response) {
        throw new Error();
      }

      return [
        response.map(({ id, src, position }) => {
          return { id, src, position };
        }),
      ];
    } catch (e) {
      return [
        undefined,
        {
          name: 'Internal Server Error',
          message: 'Server Side Error: getExistingProductImages failed',
        },
      ];
    }
  }

  async upsertProductAllergenSet(
    newProductAllergenIds: number[],
    productId: number,
  ): Promise<[ProductFeature[]?, Error?]> {
    try {
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
        this.prisma.intermediateProductAllergen.deleteMany({
          where: {
            OR: allergensToDelete.map((productAllergenId) => {
              return { productAllergenId, productId };
            }),
          },
        }),
        this.prisma.intermediateProductAllergen.createMany({
          data: allergensToAdd.map((productAllergenId) => {
            return { productAllergenId, productId };
          }),
        }),
        ,
      ]);

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
    } catch (e) {
      return [
        undefined,
        {
          name: 'Internal Server Error',
          message: 'Server Side Error: upsertProductAllergenSet failed',
        },
      ];
    }
  }
  async upsertProductFoodTypeSet(
    newProductFoodTypeIds: number[],
    productId: number,
  ): Promise<[ProductFeature[]?, Error?]> {
    try {
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
        this.prisma.intermediateProductFoodType.deleteMany({
          where: {
            OR: foodTypeToDelete.map((productFoodTypeId) => {
              return { productFoodTypeId, productId };
            }),
          },
        }),
        this.prisma.intermediateProductFoodType.createMany({
          data: foodTypeToAdd.map((productFoodTypeId) => {
            return { productFoodTypeId, productId };
          }),
        }),
        ,
      ]);

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
    } catch (e) {
      return [
        undefined,
        {
          name: 'Internal Server Error',
          message: 'Server Side Error: upsertProductFoodTypeSet failed',
        },
      ];
    }
  }
  async upsertProductCookingMethodSet(
    newProductCookingMethodIds: number[],
    productId: number,
  ): Promise<[ProductFeature[]?, Error?]> {
    const [
      existingProductCookingMethods,
      getExistingProductCookingMethodsError,
    ] = await this.getExistingProductCookingMethods({ productId });
    if (getExistingProductCookingMethodsError) {
      return [
        undefined,
        {
          name: 'Internal Server Error',
          message: 'Server Side Error: getExistingProductCookingMethods failed',
        },
      ];
    }

    try {
      const existingProductCookingMethodIds = existingProductCookingMethods.map(
        ({ id }) => id,
      );
      const [cookingMethodToAdd, cookingMethodToDelete] =
        calculateAddedAndDeletedIds(
          existingProductCookingMethodIds,
          newProductCookingMethodIds,
        );

      await Promise.all([
        this.prisma.intermediateProductCookingMethod.deleteMany({
          where: {
            OR: cookingMethodToDelete.map((productCookingMethodId) => {
              return { productCookingMethodId, productId };
            }),
          },
        }),
        this.prisma.intermediateProductCookingMethod.createMany({
          data: cookingMethodToAdd.map((productCookingMethodId) => {
            return { productCookingMethodId, productId };
          }),
        }),
        ,
      ]);

      const response =
        await this.prisma.intermediateProductCookingMethod.findMany({
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
    } catch (e) {
      return [
        undefined,
        {
          name: 'Internal Server Error',
          message: 'Server Side Error: upsertProductCookingMethodSet failed',
        },
      ];
    }
  }

  async upsertProductIngredientSet(
    newProductIngredientIds: number[],
    productId: number,
  ): Promise<[ProductFeature[]?, Error?]> {
    try {
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
        this.prisma.intermediateProductIngredient.deleteMany({
          where: {
            OR: ingredientsToDelete.map((productIngredientId) => {
              return { productIngredientId, productId };
            }),
          },
        }),
        this.prisma.intermediateProductIngredient.createMany({
          data: ingredientsToAdd.map((productIngredientId) => {
            return { productIngredientId, productId };
          }),
        }),
        ,
      ]);

      const response = await this.prisma.intermediateProductIngredient.findMany(
        {
          where: { productId },
          select: { productIngredient: true },
        },
      );
      return [
        response.map(({ productIngredient }) => {
          return {
            id: productIngredient.id,
            label: productIngredient.label,
            name: productIngredient.name,
          };
        }),
      ];
    } catch (e) {
      return [
        undefined,
        {
          name: 'Internal Server Error',
          message: 'Server Side Error: upsertProductIngredientSet failed',
        },
      ];
    }
  }

  async upsertProductImageSet(
    newProductImages: ProductImage[],
    productId: number,
  ): Promise<[ProductImage[]?, Error?]> {
    try {
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
        this.prisma.productImage.deleteMany({
          where: {
            OR: imagesToDelete.map(({ src, position }) => {
              return { src, position };
            }),
          },
        }),
        this.prisma.productImage.createMany({
          data: imagesToAdd.map(({ src, position }) => {
            return { src, position, productId };
          }),
        }),
      ]);
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
          data: {
            mainProductImageId: newMainProductImage.id,
          },
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
    } catch (e) {
      return [
        undefined,
        {
          name: 'Internal Server Error',
          message: 'Server Side Error: upsertProductImageSet failed',
        },
      ];
    }
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
  }: UpsertProductArgs): Promise<[Product?, Error?]> {
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
    try {
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
          productNutritionFact: {
            create: productNutritionInput,
          },
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
        mainProductImageId,
        productImages,
      } = response;

      if (!id || !sku || !productName || !productLabel) {
        throw new Error();
      }

      return [{ id, sku, name: productName, label: productLabel }];
    } catch (e) {
      return [
        undefined,
        {
          name: 'Internal Server Error',
          message: 'Server Side Error: upsertProduct failed',
        },
      ];
    }
  }
  async getProductsBySku({
    products,
  }: GetProductsBySkuArgs): Promise<[DisplayProduct[]?, Error?]> {
    try {
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
    } catch (e) {
      return [
        undefined,
        {
          name: 'Internal Server Error',
          message: 'Server Side Error: getProductsBySku failed',
        },
      ];
    }
  }

  async getAllProducts({
    medicalCondtions,
  }: GetAllProductsArgs): Promise<[DisplayAnalyzeProduct[]?, Error?]> {
    try {
      const res = await this.prisma.product.findMany({
        where: {
          activeStatus: 'active',
          productNutritionFact: medicalCondtions.highBloodPressure
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
          intermediateProductAllergens: {
            select: {
              productAllergen: {
                select: { id: true, name: true, label: true },
              },
            },
          },
          intermediateProductFoodTypes: {
            select: {
              productFoodType: {
                select: { id: true, name: true, label: true },
              },
            },
          },
          intermediateProductCookingMethods: {
            select: {
              productCookingMethod: {
                select: { id: true, name: true, label: true },
              },
            },
          },
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
    } catch (e) {
      return [
        undefined,
        {
          name: 'Internal Server Error',
          message: 'Server Side Error: getAllProducts failed',
        },
      ];
    }
  }

  async getOptions({
    target,
  }: GetOptionsArgs): Promise<[ProductFeature[]?, Error?]> {
    try {
      let getOptionsRes: ProductFeature[] = [];
      switch (target) {
        case 'cookingMethod':
          getOptionsRes = await this.prisma.productCookingMethod.findMany({
            select: { id: true, name: true, label: true },
          });
          break;
        case 'flavor':
          getOptionsRes = await this.prisma.productFlavor.findMany({
            select: { id: true, name: true, label: true },
          });
          break;
        case 'category':
          getOptionsRes = await this.prisma.productCategory.findMany({
            select: { id: true, name: true, label: true, src: true },
          });

          break;
        case 'foodType':
          getOptionsRes = await this.prisma.productFoodType.findMany({
            select: { id: true, name: true, label: true },
          });
          break;
        case 'allergen':
          getOptionsRes = await this.prisma.productAllergen.findMany({
            select: { id: true, name: true, label: true },
          });

          break;
        case 'ingredient':
          getOptionsRes = await this.prisma.productIngredient.findMany({
            select: { id: true, name: true, label: true },
          });
          break;
        default:
          break;
      }

      if (getOptionsRes.length <= 0) {
        throw new Error();
      }

      return [getOptionsRes];
    } catch (e) {
      return [
        undefined,
        {
          name: 'Internal Server Error',
          message: 'Server Side Error: getOptions failed',
        },
      ];
    }
  }
}
