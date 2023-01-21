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
    const [customerSession, invalidCustomerSessionError] =
    await this.customerSessionRepository.getCustomerByCustomerSession({ sessionId });
    if(invalidCustomerSessionError){
      return [undefined, invalidCustomerSessionError];
    }

    return [customerSession.customer];
  }
}
