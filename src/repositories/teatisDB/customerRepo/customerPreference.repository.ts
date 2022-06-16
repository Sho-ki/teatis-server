import { Injectable } from '@nestjs/common';

import { AverageScores } from '@Domains/AverageScores';
import { Product } from '@Domains/Product';

import { PrismaService } from '../../../prisma.service';

interface GetNextWantArgs {
  orderNumber: string;
}

interface GetNextUnwantArgs {
  email: string;
}

interface GetAverageScoresArgs {
  email: string;
}

export interface CustomerPreferenceRepoInterface {
  getNextWant({ orderNumber }: GetNextWantArgs): Promise<[Product[]?, Error?]>;
  getNextUnwant({ email }: GetNextUnwantArgs): Promise<[Product[]?, Error?]>;
  getAverageScores({
    email,
  }: GetAverageScoresArgs): Promise<[AverageScores?, Error?]>;
}

@Injectable()
export class CustomerPreferenceRepo implements CustomerPreferenceRepoInterface {
  constructor(private prisma: PrismaService) {}

  async getNextWant({
    orderNumber,
  }: GetNextWantArgs): Promise<[Product[]?, Error?]> {
    try {
      const response = await this.prisma.surveyQuestionAnswer.findMany({
        where: {
          AND: [{ orderNumber }, { answerNumeric: 6 }],
        },
        select: {
          product: {
            select: { id: true, name: true, label: true, externalSku: true },
          },
        },
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
    } catch (e) {
      return [
        undefined,
        {
          name: 'Internal Server Error',
          message: 'Server Side Error: getNextWant failed',
        },
      ];
    }
  }

  async getNextUnwant({
    email,
  }: GetNextUnwantArgs): Promise<[Product[]?, Error?]> {
    try {
      const response = await this.prisma.surveyQuestionAnswer.findMany({
        where: {
          AND: [{ customer: { email } }, { answerNumeric: 1 }],
        },
        select: {
          product: {
            select: { id: true, label: true, externalSku: true, name: true },
          },
        },
      });
      const nextUnwantProducts: Product[] = response.length
        ? response.map(({ product }) => {
            return {
              id: product.id,
              name: product.name,
              sku: product.externalSku,
              label: product.label,
            };
          })
        : [];
      return [nextUnwantProducts];
    } catch (e) {
      return [
        undefined,
        {
          name: 'Internal Server Error',
          message: 'Server Side Error: getNextUnwant failed',
        },
      ];
    }
  }

  async getAverageScores({
    email,
  }: GetAverageScoresArgs): Promise<[AverageScores?, Error?]> {
    try {
      const res = await this.prisma.surveyQuestionAnswer.findMany({
        where: { customer: { email }, answerNumeric: { not: null } },
        select: {
          product: {
            select: { productCategoryId: true, productFlavorId: true },
          },
          answerNumeric: true,
        },
      });
      let flavorLikesAverages: { [key: string]: number } = {};
      let categoryLikesAverages: { [key: string]: number } = {};

      for (let data of res) {
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
    } catch (e) {
      return [
        undefined,
        {
          name: 'Internal Server Error',
          message: 'Server Side Error: getAverageScores failed',
        },
      ];
    }
  }
}
