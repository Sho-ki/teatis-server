import { Inject, Injectable } from '@nestjs/common';

import { AverageScores } from '@Domains/AverageScores';
import { Product } from '@Domains/Product';

import { PrismaService } from '../../../prisma.service';
import { ReturnValueType } from '@Filters/customError';
import { Prisma, PrismaClient } from '@prisma/client';
import { Transactionable } from '../../utils/transactionable.interface';

interface GetNextWantArgs {
  uuid: string;
}

interface GetNextUnwantedArgs {
  uuid: string;
}

interface GetAverageScoresArgs {
  email: string;
}

export interface CustomerPreferenceRepositoryInterface extends Transactionable{
  getNextWant({ uuid }: GetNextWantArgs): Promise<ReturnValueType<Product[]>>;
  getNextUnwanted({ uuid }: GetNextUnwantedArgs): Promise<ReturnValueType<Product[]>>;
  getAverageScores({ email }: GetAverageScoresArgs): Promise<[AverageScores?, Error?]>;
}

@Injectable()
export class CustomerPreferenceRepository
implements CustomerPreferenceRepositoryInterface
{
  private originalPrismaClient : PrismaClient;
  constructor(@Inject(PrismaService) private prisma: PrismaClient | Prisma.TransactionClient) {}
  setPrismaClient(prisma: Prisma.TransactionClient): CustomerPreferenceRepositoryInterface {
    this.originalPrismaClient = this.prisma as PrismaClient;
    this.prisma = prisma;

    return this;
  }

  setDefaultPrismaClient() {
    this.prisma = this.originalPrismaClient;
  }

  async getNextWant({ uuid }: GetNextWantArgs): Promise<ReturnValueType<Product[]>> {
    const response = await this.prisma.surveyQuestionResponse.findMany({
      where: { response: { equals: 6 }, customerSurveyHistory: { customer: { uuid } }, surveyQuestion: { name: 'productSatisfaction' } },
      orderBy: { createdAt: 'desc' }, take: 1,
      include: { intermediateProductSurveyQuestionResponse: { include: { product: true } } },
    });
    const nextWantProducts: Product[] = response.length
      ? response.map(({ intermediateProductSurveyQuestionResponse }) => {
        const { product } = intermediateProductSurveyQuestionResponse[0];
        return {
          id: product.id,
          name: product.name,
          sku: product.externalSku,
          label: product.label,
        };
      })
      : [];
    return [nextWantProducts];

  }

  async getNextUnwanted({ uuid }: GetNextUnwantedArgs): Promise<ReturnValueType<Product[]>> {

    const response = await this.prisma.surveyQuestionResponse.findMany({
      where: { response: { equals: 1 }, customerSurveyHistory: { customer: { uuid } }, surveyQuestion: { name: 'productSatisfaction' } },
      include: { intermediateProductSurveyQuestionResponse: { include: { product: true } } },
    });
    const nextUnwantedProducts: Product[] = response.length
      ? response.map(({ intermediateProductSurveyQuestionResponse }) => {
        const { product } = intermediateProductSurveyQuestionResponse[0];
        return {
          id: product.id,
          name: product.name,
          sku: product.externalSku,
          label: product.label,
        };
      })
      : [];
    return [nextUnwantedProducts];

  }

  async getAverageScores({ email }: GetAverageScoresArgs): Promise<[AverageScores?, Error?]> {

    const res = await this.prisma.surveyQuestionAnswer.findMany({
      where: { customer: { email }, answerNumeric: { not: null } },
      select: {
        product: { select: { productCategoryId: true, productFlavorId: true } },
        answerNumeric: true,
      },
    });
    const flavorLikesAverages: { [key: string]: number } = {};
    const categoryLikesAverages: { [key: string]: number } = {};

    for (const data of res) {
      const flavorId = data.product.productFlavorId;
      const categoryId = data.product.productCategoryId;
      const score = data.answerNumeric;
      flavorLikesAverages[flavorId] = !flavorLikesAverages[flavorId]
        ? score
        : Math.round(((flavorLikesAverages[flavorId] + score) / 2) * 10) / 10;

      categoryLikesAverages[categoryId] = !categoryLikesAverages[categoryId]
        ? score
        : Math.round(((categoryLikesAverages[categoryId] + score) / 2) * 10) /
            10;
    }
    return [{ flavorLikesAverages, categoryLikesAverages }];

  }
}
