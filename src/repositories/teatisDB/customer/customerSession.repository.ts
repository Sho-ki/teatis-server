import { Injectable } from '@nestjs/common';

import { PrismaService } from '../../../prisma.service';
import { ReturnValueType } from '@Filters/customError';
import {  CustomerSessionInformation } from '@Domains/CustomerSessionInformation';

interface UpsertCustomerSessionArgs {
  customerId: number;
  sessionId:string;
}

interface GetCustomerByCustomerSessionArgs {
  sessionId:string;
}

export interface CustomerSessionRepositoryInterface {
  upsertCustomerSession({ customerId, sessionId }: UpsertCustomerSessionArgs):
  Promise<CustomerSessionInformation>;

  getCustomerByCustomerSession({ sessionId }:GetCustomerByCustomerSessionArgs):
  Promise<ReturnValueType<CustomerSessionInformation>>;
}

@Injectable()
export class CustomerSessionRepository
implements CustomerSessionRepositoryInterface
{
  constructor(private prisma: PrismaService) {}

  async upsertCustomerSession({ customerId, sessionId }: UpsertCustomerSessionArgs):
  Promise<CustomerSessionInformation> {
    const response = await this.prisma.customerSession.upsert(
      {
        where: { sessionId }, include: { customer: true },
        create: { customerId, sessionId },
        update: { sessionId },
      });
    return response;
  }

  async getCustomerByCustomerSession({ sessionId }:GetCustomerByCustomerSessionArgs):
  Promise<ReturnValueType<CustomerSessionInformation>>{
    const response = await this.prisma.customerSession.findUnique(
      { where: { sessionId }, include: { customer: true } });
    if(!response){
      return [undefined, { name: 'getCustomerByCustomerSession failed', message: 'sessionId is invalid' }];
    }
    return [response];
  }

}
