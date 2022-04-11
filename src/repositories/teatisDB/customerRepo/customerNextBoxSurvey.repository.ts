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
  }: GetNextWantArgs): Promise<[GetNextWantRes, Error]>;
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
  }: GetNextWantArgs): Promise<[GetNextWantRes, Error]> {
    const getNextWantRes = await this.prisma.surveyQuestionAnswer.findMany({
      where: {
        AND: [{ orderNumber }, { answerNumeric: 6 }],
      },
      select: {
        product: { select: { id: true } },
      },
    });
    return [
      {
        ids: getNextWantRes?.map((nextWant) => {
          return nextWant.product.id;
        }),
      },
      null,
    ];
  }

  async getNextUnwant({
    email,
  }: GetNextUnwantArgs): Promise<[GetNextUnwantRes, Error]> {
    const getNextUnwantRes = await this.prisma.surveyQuestionAnswer.findMany({
      where: {
        AND: [{ customer: { email } }, { answerNumeric: 1 }],
      },
      select: {
        product: { select: { id: true } },
      },
    });
    return [
      {
        ids: getNextUnwantRes.map((nextUnwant) => {
          return nextUnwant.product.id;
        }),
      },
      null,
    ];
  }
}
