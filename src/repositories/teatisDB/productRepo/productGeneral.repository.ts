import { Injectable } from '@nestjs/common';
import {
  DisplayAnalyzeProduct,
  DisplayProduct,
  Product,
  ProductAddOn,
  ProductImage,
} from '@Domains/Product';
import { PrismaService } from '../../../prisma.service';
import { calculateAddedAndDeletedNumbers } from '../../utils/calculateAddedAndDeletedNumbers';

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

export interface GetOptionsRes<T> {
  option: T[];
}

export interface GetOption {
  id: number;
  name: string;
  label: string;
  src?: string | null;
}

interface UpsertProductArgs {
  activeStatus?: 'active' | 'inactive';
  preservationStyle?: 'normal' | 'refrigerated' | 'frozen';
  allergenLabel?: string;
  ingredientLabel?: string;
  expertComment?: string;
  WSP?: number;
  MSP?: number;
  label: string;
  name?: string;
  productProviderId: number;
  upcCode?: string;
  flavorId?: number;
  categoryId?: number;
  vendorId?: number;
  externalSku: string;
  allergenIds?: number[];
  foodTypeIds?: number[];
  images?: { src: string; position: number }[];
  ingredientIds?: number[];
  cookingMethodIds?: number[];
  nutritionFact: {
    quantity: number;
    servingSize: number;
    calories: number;
    totalFat: number;
    saturatedFat: number;
    transFat: number;
    cholesterole: number;
    sodium: number;
    totalCarbohydrate: number;
    dietaryFiber: number;
    totalSugar: number;
    addedSugar: number;
    protein: number;
    sweet: number;
    sour: number;
    salty: number;
    bitter: number;
    spicy: number;
    texture: string;
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
    allergenIds,
    foodTypeIds,
    images,
    ingredientIds,
    cookingMethodIds,
    nutritionFact,
  }: UpsertProductArgs): Promise<[Product?, Error?]>;

  getProductsBySku({
    products,
  }: GetProductsBySkuArgs): Promise<[DisplayProduct[]?, Error?]>;
  getAllProducts({
    medicalCondtions,
  }: GetAllProductsArgs): Promise<[DisplayAnalyzeProduct[]?, Error?]>;
  getOptions({
    target,
  }: GetOptionsArgs): Promise<[GetOptionsRes<GetOption>?, Error?]>;
}

@Injectable()
export class ProductGeneralRepo implements ProductGeneralRepoInterface {
  constructor(private prisma: PrismaService) {}
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
    allergenIds: newAllergenIds,
    foodTypeIds: newFoodTypeIds,
    images: newImages,
    ingredientIds: newIngredientIds,
    cookingMethodIds: newCookingMethodIds,
    nutritionFact,
  }: UpsertProductArgs): Promise<[Product?, Error?]> {
    try {
      const [
        existingIngredients,
        existingCookingMethods,
        existingAllergens,
        existingFoodTypes,
        existingImages,
      ] = await Promise.all([
        this.prisma.intermediateProductIngredient.findMany({
          where: {
            product: { externalSku },
          },
          select: {
            productIngredient: true,
          },
        }),
        this.prisma.intermediateProductCookingMethod.findMany({
          where: {
            product: { externalSku },
          },
          select: {
            productCookingMethod: true,
          },
        }),
        this.prisma.intermediateProductAllergen.findMany({
          where: {
            product: { externalSku },
          },
          select: {
            productAllergen: true,
          },
        }),
        this.prisma.intermediateProductFoodType.findMany({
          where: {
            product: { externalSku },
          },
          select: {
            productFoodType: true,
          },
        }),
        this.prisma.productImage.findMany({
          where: {
            product: { externalSku },
          },
          select: {
            src: true,
            position: true,
          },
        }),
      ]);

      const existingIndredientIds = existingIngredients.map(
        ({ productIngredient }) => productIngredient.id,
      );
      const [ingredientsToAdd, ingredientsToDelete] =
        calculateAddedAndDeletedNumbers(
          existingIndredientIds,
          newIngredientIds,
        );

      const existingCookingMethodIds = existingCookingMethods.map(
        ({ productCookingMethod }) => productCookingMethod.id,
      );
      const [cookingMethodsToAdd, cookingMethodsToDelete] =
        calculateAddedAndDeletedNumbers(
          existingCookingMethodIds,
          newCookingMethodIds,
        );

      const existingAllergenIds = existingAllergens.map(
        ({ productAllergen }) => productAllergen.id,
      );
      const [allergensToAdd, allergensToDelete] =
        calculateAddedAndDeletedNumbers(existingAllergenIds, newAllergenIds);

      const existingFoodTypeIds = existingFoodTypes.map(
        ({ productFoodType }) => productFoodType.id,
      );
      const [foodTypesToAdd, foodTypesToDelete] =
        calculateAddedAndDeletedNumbers(existingFoodTypeIds, newFoodTypeIds);

      const existingImageSet = new Set(existingImages);
      const newImageSet = new Set(newImages);

      const imagesToDelete = existingImages.filter(
        (string) => !newImageSet.has(string),
      );
      // Delete

      const imagesToAdd = newImages.filter(
        (string) => !existingImageSet.has(string),
      );
      // Add

      await Promise.all([
        this.prisma.intermediateProductIngredient.deleteMany({
          where: {
            OR: ingredientsToDelete.map((productIngredientId) => {
              return { productIngredientId };
            }),
          },
        }),
        this.prisma.intermediateProductCookingMethod.deleteMany({
          where: {
            OR: cookingMethodsToDelete.map((productCookingMethodId) => {
              return { productCookingMethodId };
            }),
          },
        }),
        this.prisma.intermediateProductAllergen.deleteMany({
          where: {
            OR: allergensToDelete.map((productAllergenId) => {
              return { productAllergenId };
            }),
          },
        }),
        this.prisma.intermediateProductFoodType.deleteMany({
          where: {
            OR: foodTypesToDelete.map((productFoodTypeId) => {
              return { productFoodTypeId };
            }),
          },
        }),
        this.prisma.productImage.deleteMany({
          where: {
            OR: imagesToDelete.map(({ src }) => {
              return { src };
            }),
          },
        }),
      ]);

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
            create: {
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
            },
          },
          intermediateProductAllergens: {
            createMany: {
              data: allergensToAdd.map((productAllergenId) => {
                return { productAllergenId };
              }),
            },
          },
          intermediateProductFoodTypes: {
            createMany: {
              data: foodTypesToAdd.map((productFoodTypeId) => {
                return { productFoodTypeId };
              }),
            },
          },
          intermediateProductIngredients: {
            createMany: {
              data: ingredientsToAdd.map((productIngredientId) => {
                return { productIngredientId };
              }),
            },
          },
          intermediateProductCookingMethods: {
            createMany: {
              data: cookingMethodsToAdd.map((productCookingMethodId) => {
                return { productCookingMethodId };
              }),
            },
          },
          productImages: {
            createMany: {
              data: imagesToAdd.map(({ src, position }) => {
                return { src, position };
              }),
            },
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
              create: {
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
              },
              update: {
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
              },
            },
          },
          intermediateProductAllergens: {
            createMany: {
              data: allergensToAdd.map((productAllergenId) => {
                return { productAllergenId };
              }),
            },
          },
          intermediateProductFoodTypes: {
            createMany: {
              data: foodTypesToAdd.map((productFoodTypeId) => {
                return { productFoodTypeId };
              }),
            },
          },
          intermediateProductIngredients: {
            createMany: {
              data: ingredientsToAdd.map((productIngredientId) => {
                return { productIngredientId };
              }),
            },
          },
          intermediateProductCookingMethods: {
            createMany: {
              data: cookingMethodsToAdd.map((productCookingMethodId) => {
                return { productCookingMethodId };
              }),
            },
          },
          productImages: {
            createMany: {
              data: imagesToAdd.map(({ src, position }) => {
                return { src, position };
              }),
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
      const mainProductImage = productImages.find(
        ({ position }) => position === 1,
      );
      if (mainProductImage?.id !== mainProductImageId) {
        await this.prisma.product.update({
          where: { externalSku },
          data: {
            mainProductImageId: mainProductImage?.id,
          },
        });
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
                    (allergen): ProductAddOn => {
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
                    (foodType): ProductAddOn => {
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
                    (cookingMethod): ProductAddOn => {
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
  }: GetOptionsArgs): Promise<[GetOptionsRes<GetOption>?, Error?]> {
    try {
      let getOptionsRes: GetOption[] = [];
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

      return [{ option: getOptionsRes }];
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
