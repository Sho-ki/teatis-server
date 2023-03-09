import { Inject, Injectable } from '@nestjs/common';

import { PrismaService } from '../../../prisma.service';
import { Transactionable } from '../../utils/transactionable.interface';
import { PrismaClient, Prisma, EventType, CustomerEventLog } from '@prisma/client';

interface CreateCustomerEventLogArgs {
  customerId:number;
  date?:Date;
  event: EventType;
}

interface GetCustomerEventLogArgs {
  customerId:number;
  event: EventType;
}

export interface CustomerEventLogRepositoryInterface extends Transactionable{
  createCustomerEventLog({ customerId, date, event }: CreateCustomerEventLogArgs):
  Promise<CustomerEventLog>;

  getCustomerEventLog({ customerId, event }: GetCustomerEventLogArgs):
  Promise<CustomerEventLog>;
}

@Injectable()
export class CustomerEventLogRepository
implements CustomerEventLogRepositoryInterface
{
  private originalPrismaClient : PrismaClient;
  constructor(@Inject(PrismaService) private prisma: PrismaClient | Prisma.TransactionClient) {}
  setPrismaClient(prisma: Prisma.TransactionClient): CustomerEventLogRepositoryInterface {
    this.originalPrismaClient = this.prisma as PrismaClient;
    this.prisma = prisma;

    return this;
  }

  setDefaultPrismaClient() {
    this.prisma = this.originalPrismaClient;
  }

  async createCustomerEventLog({ date = new Date(), customerId, event }: CreateCustomerEventLogArgs):
  Promise<CustomerEventLog> {
    const response = await this.prisma.customerEventLog.create(
      { data: { customerId, eventDate: date, type: event } });
    return response;
  }

  async getCustomerEventLog({ customerId, event }: GetCustomerEventLogArgs):
  Promise<CustomerEventLog>{
    const response = await this.prisma.customerEventLog.findFirst(
      { where: { customerId, type: event }, orderBy: { eventDate: 'desc' } }
    );
    return response;
  }
}
