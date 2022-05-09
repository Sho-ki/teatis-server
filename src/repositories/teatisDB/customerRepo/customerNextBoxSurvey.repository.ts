import { Injectable } from '@nestjs/common';

import { PrismaService } from '../../../prisma.service';

interface GetNextWantArgs {
  orderNumber: string;
}

export interface GetNextWantRes {
  ids: number[];
}

interface GetNextUnwantArgs {
  email: string;
}

interface GetNextUnwantRes {
  ids: number[];
}

export interface CustomerNextBoxSurveyRepoInterface {
  getNextWant({
    orderNumber,
  }: GetNextWantArgs): Promise<[GetNextWantRes?, Error?]>;
  getNextUnwant({
    email,
  }: GetNextUnwantArgs): Promise<[GetNextUnwantRes, Error]>;
}

@Injectable()
export class CustomerNextBoxSurveyRepo
  implements CustomerNextBoxSurveyRepoInterface
{
  constructor(private prisma: PrismaService) {}

  async getNextWant({
    orderNumber,
  }: GetNextWantArgs): Promise<[GetNextWantRes?, Error?]> {
    try {
      const res = await this.prisma.surveyQuestionAnswer.findMany({
        where: {
          AND: [{ orderNumber }, { answerNumeric: 6 }],
        },
        select: {
          product: { select: { id: true } },
        },
      });
      return [
        {
          ids: res.length
            ? res.map((nextWant) => {
                return nextWant.product.id;
              })
            : [],
        },
      ];
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
  }: GetNextUnwantArgs): Promise<[GetNextUnwantRes, Error]> {
    try {
      const res = await this.prisma.surveyQuestionAnswer.findMany({
        where: {
          AND: [{ customer: { email } }, { answerNumeric: 1 }],
        },
        select: {
          product: { select: { id: true } },
        },
      });
      return [
        {
          ids: res.length
            ? res.map((nextUnwant) => {
                return nextUnwant.product.id;
              })
            : [],
        },
        null,
      ];
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
