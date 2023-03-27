import { Inject, Injectable } from '@nestjs/common';

import { PrismaService } from '../../../prisma.service';
import { Transactionable } from '../../utils/transactionable.interface';
import { PrismaClient, Prisma, RewardEventType, CustomerPointLog } from '@prisma/client';
import { ReturnValueType } from '../../../filter/customError';

interface CreateCustomerPointLogArgs {
  customerId:number;
  type:RewardEventType;
  points:number;
  eventDate?:Date;
}

export interface CustomerPointLogRepositoryInterface extends Transactionable {
  createCustomerPointLog({ customerId, type, points }: CreateCustomerPointLogArgs):
  Promise<ReturnValueType<CustomerPointLog>>;
}

@Injectable()
export class CustomerPointLogRepository
implements CustomerPointLogRepositoryInterface
{
  private originalPrismaClient : PrismaClient;
  constructor(@Inject(PrismaService) private prisma: PrismaClient | Prisma.TransactionClient) {}
  setPrismaClient(prisma: Prisma.TransactionClient): CustomerPointLogRepositoryInterface {
    this.originalPrismaClient = this.prisma as PrismaClient;
    this.prisma = prisma;

    return this;
  }

  setDefaultPrismaClient() {
    this.prisma = this.originalPrismaClient;
  }

  async createCustomerPointLog({ customerId, type, points,  eventDate = new Date() }: CreateCustomerPointLogArgs):
  Promise<ReturnValueType< CustomerPointLog>> {
    const response = await this.prisma.customerPointLog.create(
      { data: { customerId, type, points, eventDate } });
    return [response];
  }

}
