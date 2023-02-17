import { Inject, Injectable } from '@nestjs/common';

import { PrismaService } from '../../../prisma.service';
import { MonthlyBoxSelectionProduct } from '@Domains/MonthlyBoxSelectionProduct';
import { ReturnValueType } from '../../../filter/customError';
import { Transactionable } from '../../utils/transactionable.interface';
import { Prisma, PrismaClient } from '@prisma/client';
import { DisplayProduct } from '../../../domains/Product';
import { nutritionFactField } from '../../utils/nutritionFactField';

interface GetMonthlySelectionArgs {
  date:Date;
  boxPlan: 'mini' | 'standard' | 'max';
}

export interface MonthlySelectionRepositoryInterface extends Transactionable{
  getMonthlySelection({ date, boxPlan }: GetMonthlySelectionArgs):
  Promise<ReturnValueType<MonthlyBoxSelectionProduct>>;

}

@Injectable()
export class MonthlySelectionRepository
implements MonthlySelectionRepositoryInterface
{
  private originalPrismaClient : PrismaClient;
  constructor(@Inject(PrismaService) private prisma: PrismaClient | Prisma.TransactionClient) {}
  setPrismaClient(prisma: Prisma.TransactionClient): MonthlySelectionRepositoryInterface {
    this.originalPrismaClient = this.prisma as PrismaClient;
    this.prisma = prisma;
    return this;
  }

  setDefaultPrismaClient() {
    this.prisma = this.originalPrismaClient;
  }

  async getMonthlySelection({ date = new Date(), boxPlan }: GetMonthlySelectionArgs):
  Promise<ReturnValueType<MonthlyBoxSelectionProduct>> {
    const month = date.toLocaleString('default', { month: 'short' });
    const year = date.getFullYear();
    const boxLabel = `${year}-${month}`;
    const response = await this.prisma.monthlyBoxSelection.findUnique(
      {
        where: { MonthlyBoxIdentifier: { label: boxLabel, boxPlan } },
        include: {
          intermediateMonthlyBoxSelectionProduct: {
            include: {
              product:
          { include: { productVendor: true, productImages: true, productNutritionFact: true } },
            },
          },
        },
      });

    if(!response || !response?.intermediateMonthlyBoxSelectionProduct?.length){
      return [undefined, { name: 'getMonthlySelection failed', message: `Products of ${boxLabel} hasn't been selected yet` }];
    }
    const products:DisplayProduct[] =
     response.intermediateMonthlyBoxSelectionProduct.map(({ product }) =>
     {  return {
       id: product.id,
       sku: product.externalSku,
       name: product.name,
       label: product.label,
       expertComment: product.expertComment,
       glucoseValues: product.glucoseValues || JSON.parse('[]'),
       ingredientLabel: product.ingredientLabel,
       images: product.productImages,
       allergenLabel: product.allergenLabel,
       vendor: product.productVendor,
       nutritionFact: product?.productNutritionFact? nutritionFactField(product.productNutritionFact): null,
     }; });

    delete response.intermediateMonthlyBoxSelectionProduct;
    return [
      {
        ...response,
        products,
      },
    ];
  }

}
