import { Inject, Injectable } from '@nestjs/common';

import { AverageScores } from '@Domains/AverageScores';
import { Product } from '@Domains/Product';

import { PrismaService } from '../../../prisma.service';
import { ReturnValueType } from '@Filters/customError';
import { Prisma, PrismaClient } from '@prisma/client';
import { Transactionable } from '../../utils/transactionable.interface';

interface GetNextWantArgs {
  orderNumber: string;
}

interface GetNextUnwantedArgs {
  email: string;
}

interface GetAverageScoresArgs {
  email: string;
}

export interface CustomerPreferenceRepositoryInterface extends Transactionable{
  getNextWant({ orderNumber }: GetNextWantArgs): Promise<ReturnValueType<Product[]>>;
  getNextUnwanted({ email }: GetNextUnwantedArgs): Promise<ReturnValueType<Product[]>>;
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

  async getNextWant({ orderNumber }: GetNextWantArgs): Promise<ReturnValueType<Product[]>> {
    const response = await this.prisma.surveyQuestionAnswer.findMany({
      where: { AND: [{ orderNumber }, { answerNumeric: 6 }] },
      select: { product: { select: { id: true, name: true, label: true, externalSku: true } } },
    });
    const nextWantProducts: Product[] = response.length
      ? response.map(({ product }) => {
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

  async getNextUnwanted({ email }: GetNextUnwantedArgs): Promise<ReturnValueType<Product[]>> {

    const response = await this.prisma.surveyQuestionAnswer.findMany({
      where: { AND: [{ customer: { email } }, { answerNumeric: 1 }] },
      select: { product: { select: { id: true, label: true, externalSku: true, name: true } } },
    });
    const nextUnwantedProducts: Product[] = response.length
      ? response.map(({ product }) => {
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
