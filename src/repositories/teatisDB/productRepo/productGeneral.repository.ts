import { Injectable } from '@nestjs/common';
import {
  DisplayAnalyzeProduct,
  DisplayProduct,
  Product,
  ProductAddOn,
  ProductImage,
} from '@Domains/Product';
import { PrismaService } from '../../../prisma.service';

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

export interface ProductGeneralRepoInterface {
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
          productVendor: { select: { label: true, id: true, name: true } },
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
                  id: product?.productVendor?.id,
                  label: product?.productVendor?.label,
                  name: product?.productVendor?.name,
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
