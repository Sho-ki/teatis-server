import { Injectable } from '@nestjs/common';
import { Prisma, Discoveries, Customers } from '@prisma/client';
import { PrismaService } from '../../../prisma.service';
import {
  LastOrderNumberAndProducts,
  LastOrderProducts,
} from '../../../domains/model/teatisDB/productRepo/productPostPurchaseSurvey';
import { Product } from '../../../domains/entity/product/product';
import { QuestionOptions } from '../../../domains/entity/surveyQuestions/surveyQuestions';

interface UpsertProductArgs {
  sku: string;
}

export interface UpsertProductRes {
  id: number;
}

export interface ProductPostPurchaseSurveyRepoInterface {
  addProductIds(lastOrderProducts: LastOrderProducts[]): Promise<any>;

  upsertProduct({ sku }: UpsertProductArgs): Promise<UpsertProductRes>;

  getCustomerAnswerOptions(
    customerQuestionAnswerId: number,
  ): Promise<QuestionOptions[]>;
}

@Injectable()
export class ProductPostPurchaseSurveyRepo
  implements ProductPostPurchaseSurveyRepoInterface
{
  constructor(private prisma: PrismaService) {}

  async getCustomerAnswerOptions(
    customerQuestionAnswerId: number,
  ): Promise<QuestionOptions[]> {
    let customerAnswerOptions =
      await this.prisma.intermediateSurveyQuestionAnswerService.findMany({
        where: {
          surveyQuestionAnswerServiceFeedbackId: customerQuestionAnswerId,
        },
        select: {
          surveyQuestionOptionId: true,
          surveyQuestionOption: { select: { label: true } },
        },
      });

    return customerAnswerOptions.map((customerAnswerOption) => {
      return {
        id: customerAnswerOption.surveyQuestionOptionId,
        label: customerAnswerOption.surveyQuestionOption.label,
      };
    });
  }
  async upsertProduct({ sku }: UpsertProductArgs): Promise<UpsertProductRes> {
    const upsertedProduct = await this.prisma.product.upsert({
      where: { externalSku: sku },
      create: {
        externalSku: sku,
        productPovider: {
          connectOrCreate: {
            where: { provider: 'shiphero' },
            create: { provider: 'shiphero' },
          },
        },
      },
      update: {},
    });
    return { id: upsertedProduct.id };
  }

  async addProductIds(lastOrderProducts: LastOrderProducts[]): Promise<any> {
    await Promise.all(
      lastOrderProducts.map(async (product, index) => {
        const productId = await this.prisma.product.upsert({
          where: { externalSku: product.sku },
          create: {
            externalSku: product.sku,
            productPovider: {
              connectOrCreate: {
                where: { provider: 'shiphero' },
                create: { provider: 'shiphero' },
              },
            },
          },
          update: {},
        });
        lastOrderProducts[index] = {
          ...lastOrderProducts[index],
          productId: productId.id,
        };
      }),
    );
  }
}
