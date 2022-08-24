import { Injectable } from '@nestjs/common';
import { DisplayProduct, Product } from '@Domains/Product';

import { PrismaService } from '../../../prisma.service';
import { calculateAddedAndDeletedIds } from '../../utils/calculateAddedAndDeletedIds';
import { ReturnValueType } from '@Filters/customError';
import { TeatisBox } from '@Domains/TeatisBox';

interface getTeatisBoxByLabelArgs {
  label: string;
}

interface createTeatisBoxArgs {
  label: string;
  products: { id: number }[];
  description?: string;
  note?: string;
}

export interface TeatisBoxRepositoryInterface {
  getTeatisBoxByLabel({ label }: getTeatisBoxByLabelArgs): Promise<ReturnValueType<TeatisBox>>;

  createTeatisBox({
    label,
    products,
    description,
    note,
  }: createTeatisBoxArgs): Promise<ReturnValueType<TeatisBox>>;
}

@Injectable()
export class TeatisBoxRepository
implements TeatisBoxRepositoryInterface
{
  constructor(private prisma: PrismaService) {}

  async createTeatisBox({
    label,
    products,
    description,
    note,
  }: createTeatisBoxArgs): Promise<ReturnValueType<TeatisBox>> {
    const intermediateTable = this.prisma.intermediateTeatisBoxProduct;
    const teatisBoxTable = this.prisma.teatisBox;
    const existingProducts =
      await intermediateTable.findMany({
        where: { teatisBox: { label } },
        select: { product: true },
      });
    const existingProductIds = existingProducts? existingProducts.map(
      ({ product }) => product.id,
    ): [];
    const newProductIds = products.map((product) => product.id);

    const [productIdsToAdd, productIdsToRemove] = calculateAddedAndDeletedIds(existingProductIds, newProductIds );
    if(productIdsToRemove.length)
      await intermediateTable.deleteMany({
        where: {
          OR: productIdsToRemove.map((productId) => {
            return { productId };
          }),
          teatisBox: { label },
        },
      });
    const response = await teatisBoxTable.upsert({
      where: { label },
      create: {
        label,
        description,
        note,
        intermediateTeatisBoxProduct: {
          createMany: {
            data: productIdsToAdd.map((productId) => {
              return { productId };
            }),
          },
        },
      },
      update: {
        description,
        note,
        intermediateTeatisBoxProduct: {
          createMany: {
            data: productIdsToAdd.map((productId) => {
              return { productId };
            }),
          },
        },
      },
      select: {
        intermediateTeatisBoxProduct: { select: { product: true } },
        id: true,
        label: true,
        description: true,
        note: true,
      },
    });
    const boxProducts: Product[] =
      response.intermediateTeatisBoxProduct.map(({ product }) => {
        return {
          id: product.id,
          sku: product.externalSku,
          name: product.name,
          label: product.label,
        };
      });
    const teatisBox: TeatisBox = {
      id: response.id,
      label: response.label,
      description: response.description,
      note: response.note,
      products: boxProducts,
    };
    return [{ ...teatisBox }];
  }
  async getTeatisBoxByLabel({ label }: getTeatisBoxByLabelArgs): Promise<ReturnValueType<TeatisBox>> {
    const response = await this.prisma.teatisBox.findUnique({
      where: { label },
      select: {
        intermediateTeatisBoxProduct: {
          select: {
            product: {
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
            },
          },
        },
        id: true,
        label: true,
        description: true,
        note: true,
      },
    });

    if (!response?.intermediateTeatisBoxProduct) {
      return [
        undefined,
        {
          name: 'Internal Server Error',
          message: `label: ${label} is does not exist`,
        },
      ];
    }
    const boxProducts: DisplayProduct[] = response
      .intermediateTeatisBoxProduct.length
      ? response.intermediateTeatisBoxProduct.map(({ product }) => {
        return {
          id: product.id,
          sku: product.externalSku,
          name: product.name,
          label: product.label,
          expertComment: product.expertComment,
          ingredientLabel: product.ingredientLabel,
          images: product.productImages,
          allergenLabel: product.allergenLabel,
          vendor: product.productVendor.label,
          nutritionFact: {
            calorie: product.productNutritionFact.calories,
            totalFat: product.productNutritionFact.totalFatG,
            saturatedFat: product.productNutritionFact.saturatedFatG,
            transFat: product.productNutritionFact.transFatG,
            cholesterole: product.productNutritionFact.cholesteroleMg,
            sodium: product.productNutritionFact.sodiumMg,
            totalCarbohydrate:
                product.productNutritionFact.totalCarbohydrateG,
            dietaryFiber: product.productNutritionFact.dietaryFiberG,
            totalSugar: product.productNutritionFact.totalSugarG,
            addedSugar: product.productNutritionFact.addedSugarG,
            protein: product.productNutritionFact.proteinG,
          },
        };
      })
      : [];

    const practitionerBox: TeatisBox = {
      id: response.id,
      label: response.label,
      description: response.description,
      note: response.note,
      products: boxProducts,
    };
    return [{ ...practitionerBox }, undefined];
  }
}
