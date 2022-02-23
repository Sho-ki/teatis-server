import { Injectable } from '@nestjs/common';
import { Prisma, Discoveries, Customers } from '@prisma/client';
import { PrismaService } from '../../../prisma.service';

import { Product } from '../../../domains/entity/product/product';
import { QuestionOptions } from '../../../domains/entity/surveyQuestions/surveyQuestions';

interface UpsertProductArgs {
  sku: string;
}

export interface UpsertProductRes {
  id: number;
}

export interface ProductPostPurchaseSurveyRepoInterface {
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
}
