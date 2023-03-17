import { Inject, Injectable } from '@nestjs/common';

import { PrismaService } from '../../../prisma.service';
import { ReturnValueType } from '../../../filter/customError';
import { CustomerRewardToken, Prisma, PrismaClient } from '@prisma/client';
import { Transactionable } from '../../utils/transactionable.interface';

interface CreateCustomerRewardTokenArgs {
  customerId: number;
}
export interface CustomerRewardTokenRepositoryInterface extends Transactionable{
  createCustomerRewardToken({ customerId }:CreateCustomerRewardTokenArgs):
  Promise<ReturnValueType<CustomerRewardToken>>;

  getCustomerRewardToken(pointToken:string): Promise<ReturnValueType<CustomerRewardToken>>;

  deactivateCustomerRewardToken(pointToken:string): Promise<ReturnValueType<CustomerRewardToken>>;
}

@Injectable()
export class CustomerRewardTokenRepository
implements CustomerRewardTokenRepositoryInterface
{
  private originalPrismaClient : PrismaClient;
  constructor(@Inject(PrismaService) private prisma: PrismaClient | Prisma.TransactionClient) {}
  setPrismaClient(prisma: Prisma.TransactionClient): CustomerRewardTokenRepositoryInterface {
    this.originalPrismaClient = this.prisma as PrismaClient;
    this.prisma = prisma;
    return this;
  }

  setDefaultPrismaClient() {
    this.prisma = this.originalPrismaClient;
  }

  async createCustomerRewardToken({ customerId }:CreateCustomerRewardTokenArgs):
  Promise<ReturnValueType<CustomerRewardToken>> {
    const response = await this.prisma.customerRewardToken.create({ data: { customerId } });
    return [response];
  }

  async getCustomerRewardToken(pointToken:string): Promise<ReturnValueType<CustomerRewardToken>>{
    const response = await this.prisma.customerRewardToken.findUnique({ where: { pointToken } });
    if (!response) {
      return [undefined, { name: 'NotFound', message: 'PointToken not found' }];
    }
    return [response];
  }

  async deactivateCustomerRewardToken(pointToken:string): Promise<ReturnValueType<CustomerRewardToken>>{
    const response = await this.prisma.customerRewardToken.update({
      where: { pointToken },
      data: { status: 'inactive' },
    });
    return [response];
  }

}
