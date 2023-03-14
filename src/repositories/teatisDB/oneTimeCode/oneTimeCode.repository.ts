import { Injectable } from '@nestjs/common';

import { PrismaService } from '../../../prisma.service';
import { ReturnValueType } from '../../../filter/customError';
import { OneTimeCode } from '@prisma/client';

export interface OneTimeCodeRepositoryInterface {
  createOneTimeCode():
  Promise<ReturnValueType<OneTimeCode>>;

}

@Injectable()
export class OneTimeCodeRepository
implements OneTimeCodeRepositoryInterface
{
  constructor(private prisma: PrismaService) {}

  async createOneTimeCode():
  Promise<ReturnValueType<OneTimeCode>> {
    const response = await this.prisma.oneTimeCode.create({ data: {} });
    return [response];
  }

}
