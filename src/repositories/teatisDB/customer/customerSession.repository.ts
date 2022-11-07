import { Injectable } from '@nestjs/common';

import { PrismaService } from '../../../prisma.service';
import { ReturnValueType } from '@Filters/customError';
import { CustomerSession } from '@Domains/CustomerSession';

interface UpsertCustomerSessionArgs {
  customerId: number;
  sessionId:string;
}

interface GetCustomerByCustomerSessionArgs {
  sessionId:string;
}

export interface CustomerSessionRepositoryInterface {
  upsetCustomerSession({ customerId, sessionId }: UpsertCustomerSessionArgs):
  Promise<ReturnValueType<CustomerSession>>;

  getCustomerByCustomerSession({ sessionId }:GetCustomerByCustomerSessionArgs):
  Promise<ReturnValueType<CustomerSession>>;
}

@Injectable()
export class CustomerSessionRepository
implements CustomerSessionRepositoryInterface
{
  constructor(private prisma: PrismaService) {}

  async upsetCustomerSession({ customerId, sessionId }: UpsertCustomerSessionArgs):
  Promise<ReturnValueType<CustomerSession>> {
    const response = await this.prisma.customerSession.upsert(
      {
        where: { sessionId }, include: { customer: true },
        create: { customerId, sessionId },
        update: { sessionId },
      });
    return [
      {
        id: response.customer.id,
        email: response.customer.email,
        uuid: response.customer.uuid,
        sessionId: response.sessionId,
        expiredAt: response?.expiredAt,
        activeUntil: response.activeUntil,
      },
    ];
  }

  async getCustomerByCustomerSession({ sessionId='' }:GetCustomerByCustomerSessionArgs):
  Promise<ReturnValueType<CustomerSession>>{
    const response = await this.prisma.customerSession.findUnique(
      { where: { sessionId }, include: { customer: true } });
    if(!response){
      return [
        {
          id: undefined,
          email: undefined,
          uuid: undefined,
          sessionId: undefined,
          expiredAt: undefined,
          activeUntil: undefined,
        },
      ];
    }
    return [
      {
        id: response.customer.id,
        email: response.customer.email,
        uuid: response.customer.uuid,
        sessionId: response.sessionId,
        expiredAt: response?.expiredAt,
        activeUntil: response.activeUntil,
      },
    ];
  }

}
