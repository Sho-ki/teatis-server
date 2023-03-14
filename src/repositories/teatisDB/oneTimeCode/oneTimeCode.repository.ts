import { Inject, Injectable } from '@nestjs/common';

import { PrismaService } from '../../../prisma.service';
import { ReturnValueType } from '../../../filter/customError';
import { OneTimeCode, Prisma, PrismaClient } from '@prisma/client';
import { Transactionable } from '../../utils/transactionable.interface';

export interface OneTimeCodeRepositoryInterface extends Transactionable{
  createOneTimeCode():
  Promise<ReturnValueType<OneTimeCode>>;

  getOneTimeCode(pointToken:string): Promise<ReturnValueType<OneTimeCode>>;

  deactivateOneTimeCode(pointToken:string): Promise<ReturnValueType<OneTimeCode>>;
}

@Injectable()
export class OneTimeCodeRepository
implements OneTimeCodeRepositoryInterface
{
  private originalPrismaClient : PrismaClient;
  constructor(@Inject(PrismaService) private prisma: PrismaClient | Prisma.TransactionClient) {}
  setPrismaClient(prisma: Prisma.TransactionClient): OneTimeCodeRepositoryInterface {
    this.originalPrismaClient = this.prisma as PrismaClient;
    this.prisma = prisma;
    return this;
  }

  setDefaultPrismaClient() {
    this.prisma = this.originalPrismaClient;
  }

  async createOneTimeCode():
  Promise<ReturnValueType<OneTimeCode>> {
    const response = await this.prisma.oneTimeCode.create({ data: {} });
    return [response];
  }

  async getOneTimeCode(pointToken:string): Promise<ReturnValueType<OneTimeCode>>{
    const response = await this.prisma.oneTimeCode.findUnique({ where: { pointToken } });
    if (!response) {
      return [undefined, { name: 'NotFound', message: 'PointToken not found' }];
    }
    return [response];
  }

  async deactivateOneTimeCode(pointToken:string): Promise<ReturnValueType<OneTimeCode>>{
    const response = await this.prisma.oneTimeCode.update({
      where: { pointToken },
      data: { status: 'inactive' },
    });
    return [response];
  }

}
