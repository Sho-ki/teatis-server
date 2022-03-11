import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma.service';

interface UpsertProductsArgs {
  skus: string[];
}

export interface UpsertProductsRes {
  data: UpsertProductsResElement[];
}

interface UpsertProductsResElement {
  id: number;
  externalSku: string;
}

interface GetProductsArgs {
  products: { sku: string }[];
}

interface GetProductsRes {
  products: GetProductsResElement[];
}

interface GetProductsResElement {
  id: number;
  sku: string;
  label: string;
  images?: { src: string; position: number }[];
  vendor?: string;
}

interface GetOptionsArgs {
  target: string;
}

interface GetOptionsRes<T> {
  option: T[];
}

interface GetOptionsElement {
  id: number;
  name: string;
  label: string;
  src?: string;
}

export interface ProductGeneralRepoInterface {
  upsertProducts({
    skus,
  }: UpsertProductsArgs): Promise<[UpsertProductsRes, Error]>;

  getProducts({ products }: GetProductsArgs): Promise<[GetProductsRes, Error]>;
  getOptions({
    target,
  }: GetOptionsArgs): Promise<[GetOptionsRes<GetOptionsElement>, Error]>;
}

@Injectable()
export class ProductGeneralRepo implements ProductGeneralRepoInterface {
  constructor(private prisma: PrismaService) {}
  async getProducts({
    products,
  }: GetProductsArgs): Promise<[GetProductsRes, Error]> {
    let productRes = await this.prisma.product.findMany({
      where: {
        OR: products.map((product) => {
          return { externalSku: product.sku };
        }),
      },
      select: {
        id: true,
        productVendor: { select: { name: true, label: true } },
        externalSku: true,
        productImages: { select: { src: true, position: true } },
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

    let data: UpsertProductsResElement[] = await this.prisma.$queryRawUnsafe(`
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
  }: GetOptionsArgs): Promise<[GetOptionsRes<GetOptionsElement>, Error]> {
    let getOptionsRes: GetOptionsElement[];
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
          message: `getOptions(${target})  failed`,
        },
      ];
    }

    return [{ option: getOptionsRes }, null];
  }
}
