import { Injectable } from '@nestjs/common';
import { Product } from '@Domains/Product';

import { PrismaService } from '../../../prisma.service';

interface GetNextWantArgs {
  orderNumber: string;
}

interface GetNextUnwantArgs {
  email: string;
}

export interface CustomerNextBoxSurveyRepoInterface {
  getNextWant({ orderNumber }: GetNextWantArgs): Promise<[Product[]?, Error?]>;
  getNextUnwant({ email }: GetNextUnwantArgs): Promise<[Product[]?, Error?]>;
}

@Injectable()
export class CustomerNextBoxSurveyRepo
  implements CustomerNextBoxSurveyRepoInterface
{
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
}
