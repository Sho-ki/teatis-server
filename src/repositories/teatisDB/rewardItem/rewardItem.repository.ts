import { Inject, Injectable } from '@nestjs/common';

import { PrismaService } from '../../../prisma.service';
import { ReturnValueType } from '../../../filter/customError';
import { Transactionable } from '../../utils/transactionable.interface';
import { Prisma, PrismaClient } from '@prisma/client';
import { TeatisProductReward } from '../../../domains/ProductReward';
import { nutritionFactField } from '../../utils/nutritionFactField';

interface GetRewardItemsArgs {
  boxPlan: 'mini' | 'standard' | 'max';
}

export interface RewardItemsRepositoryInterface extends Transactionable {
  getRewardItems({ boxPlan }: GetRewardItemsArgs):
  Promise<ReturnValueType<TeatisProductReward[]>>;

}

@Injectable()
export class RewardItemsRepository
implements RewardItemsRepositoryInterface
{
  private originalPrismaClient : PrismaClient;
  constructor(@Inject(PrismaService) private prisma: PrismaClient | Prisma.TransactionClient) {}
  setPrismaClient(prisma: Prisma.TransactionClient): RewardItemsRepositoryInterface {
    this.originalPrismaClient = this.prisma as PrismaClient;
    this.prisma = prisma;
    return this;
  }

  setDefaultPrismaClient() {
    this.prisma = this.originalPrismaClient;
  }

  async getRewardItems({ boxPlan }: GetRewardItemsArgs):
  Promise<ReturnValueType<TeatisProductReward[]>> {
    const date = new Date();
    const month = date.toLocaleString('default', { month: 'short' });
    const year = date.getFullYear();
    const boxLabel = `${year}-${month}`;
    const response = await this.prisma.rewardItem.findMany(
      {
        where: {
          product: {
            intermediateMonthlyBoxSelectionProduct: {
              some: {
                monthlyBoxSelection:
            { boxPlan, label: boxLabel },
              },
            },
          },
        },
        include: { product: { include: { productVendor: true, productImages: true, productNutritionFact: true } } },
      });

    const products: TeatisProductReward[] = response.map(item => ({
      ...item,
      product: {
        ...item.product,
        sku: item.product.externalSku,
        nutritionFact: item.product?.productNutritionFact? nutritionFactField(item.product.productNutritionFact): null,
        glucoseValues: item.product.glucoseValues || JSON.parse('[]'),
        images: item.product.productImages,
        vendor: item.product.productVendor,
      },
    }));
    return [products];
  }

}
