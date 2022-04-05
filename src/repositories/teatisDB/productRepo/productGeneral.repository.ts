import { Injectable } from '@nestjs/common';
import { Product, ProductAddOn, ProductImage } from '../../../domains/Product';
import { PrismaService } from '../../../prisma.service';

interface UpsertProductsArgs {
  skus: string[];
}

interface UpsertProductsRes {
  data: UpsertProductsResData[];
}

interface UpsertProductsResData {
  id: number;
  externalSku: string;
}

interface GetProductsBySkuArgs {
  products: Pick<Product, 'sku'>[];
}

interface GetProductsBySkuRes {
  products: Pick<
    Product,
    'id' | 'sku' | 'label' | 'images' | 'vendor' | 'expertComment'
  >[];
}

interface GetAllProductsArgs {
  medicalCondtions: { highBloodPressure: boolean; highCholesterol: boolean };
}

interface GetAllProductsRes {
  products: Omit<Product, 'nutritionFact'>[];
}

interface GetOptionsArgs {
  target: string;
}

interface GetOptionsRes<T> {
  option: T[];
}

interface GetOption {
  id: number;
  name: string;
  label: string;
  src?: string;
}

export interface ProductGeneralRepoInterface {
  upsertProducts({
    skus,
  }: UpsertProductsArgs): Promise<[UpsertProductsRes, Error]>;

  getProductsBySku({
    products,
  }: GetProductsBySkuArgs): Promise<[GetProductsBySkuRes, Error]>;
  getAllProducts({
    medicalCondtions,
  }: GetAllProductsArgs): Promise<[GetAllProductsRes, Error]>;
  getOptions({
    target,
  }: GetOptionsArgs): Promise<[GetOptionsRes<GetOption>, Error]>;
}

@Injectable()
export class ProductGeneralRepo implements ProductGeneralRepoInterface {
  constructor(private prisma: PrismaService) {}
  async getProductsBySku({
    products,
  }: GetProductsBySkuArgs): Promise<[GetProductsBySkuRes, Error]> {
    let productRes = await this.prisma.product.findMany({
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
      },
    });

    return [
      {
        products: productRes.map((product) => {
          return {
            id: product.id,
            sku: product.externalSku,
            images: product.productImages,
            vendor: product.productVendor.label,
            label: product.label,
            expertComment: product.expertComment,
          };
        }),
      },
      null,
    ];
  }

  async getAllProducts({
    medicalCondtions,
  }: GetAllProductsArgs): Promise<[GetAllProductsRes, Error]> {
    const getAllProductsRes = await this.prisma.product.findMany({
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
        productVendor: { select: { label: true } },
        productImages: { select: { id: true, position: true, src: true } },
        productFlavor: { select: { id: true, name: true, label: true } },
        productCategory: { select: { id: true, name: true, label: true } },
        expertComment: true,
        allergenLabel: true,
        ingredientLabel: true,
        intermediateProductAllergens: {
          select: {
            productAllergen: { select: { id: true, name: true, label: true } },
          },
        },
        intermediateProductFoodTypes: {
          select: {
            productFoodType: { select: { id: true, name: true, label: true } },
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
      {
        products: getAllProductsRes.map((product) => {
          return {
            id: product.id,
            name: product.name,
            expertComment: product.expertComment,
            label: product.label,
            ingredientLabel: product.ingredientLabel,
            allergenLabel: product.allergenLabel,
            sku: product.externalSku,
            vendor: product.productVendor.label,
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
          };
        }),
      },
      null,
    ];
  }

  async upsertProducts({
    skus,
  }: UpsertProductsArgs): Promise<[UpsertProductsRes, Error]> {
    const shipheroProviderId = await this.prisma.productProvider.upsert({
      where: { provider: 'shiphero' },
      create: { provider: 'shiphero' },
      update: { provider: 'shiphero' },
    });

    const values = [];
    for (let sku of skus) {
      values.push(`('${sku}', ${shipheroProviderId.id})`);
    }

    let data: UpsertProductsResData[] = await this.prisma.$queryRawUnsafe(`
    WITH
    -- write the new values
    "newProduct"("externalSku","productProviderId") AS (
      VALUES ${values.join(',')}
    ),
    -- update existing rows
    upsert AS (
      UPDATE "Product"
      SET "externalSku"="newProduct"."externalSku", "productProviderId"="newProduct"."productProviderId"
      FROM "newProduct" WHERE "Product"."externalSku" = "newProduct"."externalSku"
      RETURNING "Product".id, "Product"."externalSku"
    ), 
    "insertNonExist" AS(
        -- insert missing rows
        INSERT INTO "Product" ("externalSku","productProviderId")
        SELECT  "newProduct"."externalSku", "newProduct"."productProviderId" FROM "newProduct" 
        WHERE "newProduct"."externalSku" NOT IN (
          SELECT "externalSku" FROM upsert
        )
      RETURNING "Product".id, "Product"."externalSku"
    )
    SELECT upsert.* from upsert UNION ALL SELECT "insertNonExist".* from "insertNonExist"
  ;
    `);
    return [{ data }, null];
  }

  async getOptions({
    target,
  }: GetOptionsArgs): Promise<[GetOptionsRes<GetOption>, Error]> {
    let getOptionsRes: GetOption[];
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
      return [
        null,
        {
          name: 'Internal Server Error',
          message: `Server Side Error: getOptions(${target}) failed`,
        },
      ];
    }

    return [{ option: getOptionsRes }, null];
  }
}
