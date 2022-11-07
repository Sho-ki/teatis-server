import {  Inject, Injectable } from '@nestjs/common';

import { ReturnValueType } from '@Filters/customError';
import { CustomerSessionRepositoryInterface } from '@Repositories/teatisDB/customer/customerSession.repository';
import { Customer } from '@Domains/Customer';

interface GetCustomerBySessionIdArgs {
  sessionId:string;
}

export interface GetCustomerBySessionIdUsecaseInterface {
  getCustomerBySessionId( { sessionId }:GetCustomerBySessionIdArgs): Promise<ReturnValueType<Customer>>;
}

@Injectable()
export class GetCustomerBySessionIdUsecase
implements GetCustomerBySessionIdUsecaseInterface
{
  constructor(
    @Inject('CustomerSessionRepositoryInterface')
    private customerSessionRepository: CustomerSessionRepositoryInterface,
  ) {}

  async getCustomerBySessionId( { sessionId }:GetCustomerBySessionIdArgs): Promise<ReturnValueType<Customer>> {
    const [customerSession, getCustomerBySessionId] =
    await this.customerSessionRepository.getCustomerByCustomerSession({ sessionId });
    if(getCustomerBySessionId){
      return [undefined, getCustomerBySessionId];
    }

    const { email, id, uuid } = customerSession;

    return [{ id, email, uuid }];
  }
}
