import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma.service';

interface UpsertProductArgs {
  sku: string;
}

export interface UpsertProductRes {
  id: number;
}

interface GetCustomerAnswerOptionsArgs {
  customerQuestionAnswerId: number;
}

export interface GetCustomerAnswerOptionsRes {
  id: number;
  label: string;
}

export interface ProductPostPurchaseSurveyRepoInterface {
  upsertProduct({ sku }: UpsertProductArgs): Promise<UpsertProductRes>;

  getCustomerAnswerOptions({
    customerQuestionAnswerId,
  }: GetCustomerAnswerOptionsArgs): Promise<GetCustomerAnswerOptionsRes[]>;
}

@Injectable()
export class ProductPostPurchaseSurveyRepo
  implements ProductPostPurchaseSurveyRepoInterface
{
  constructor(private prisma: PrismaService) {}

  async getCustomerAnswerOptions({
    customerQuestionAnswerId,
  }: GetCustomerAnswerOptionsArgs): Promise<GetCustomerAnswerOptionsRes[]> {
    let customerAnswerOptions =
      await this.prisma.intermediateSurveyQuestionAnswerService.findMany({
        where: {
          surveyQuestionAnswerServiceFeedbackId: customerQuestionAnswerId,
        },
        select: {
          surveyQuestionOptionId: true,
          surveyQuestionOption: { select: { label: true, id: true } },
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
