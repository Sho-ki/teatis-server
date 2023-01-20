import {  Inject, Injectable } from '@nestjs/common';

import { ReturnValueType } from '@Filters/customError';
import { CustomerSessionRepositoryInterface } from '@Repositories/teatisDB/customer/customerSession.repository';
import { CustomerAuthRepositoryInterface } from '@Repositories/teatisDB/customer/customerAuth.repository';
import {  CustomerIsAuthenticated } from '../../../domains/CustomerAuth';

interface CheckHasValidTokenArgs {
  sessionId:string;
}

export interface CheckHasValidTokenUsecaseInterface {
  checkHasValidToken( {  sessionId }:CheckHasValidTokenArgs): Promise<ReturnValueType<CustomerIsAuthenticated>>;
}

@Injectable()
export class CheckHasValidTokenUsecase
implements CheckHasValidTokenUsecaseInterface
{
  constructor(
    @Inject('CustomerSessionRepositoryInterface')
    private customerSessionRepository: CustomerSessionRepositoryInterface,
    @Inject('CustomerAuthRepositoryInterface')
    private customerAuthRepository: CustomerAuthRepositoryInterface,
  ) {}

  async checkHasValidToken( { sessionId }:CheckHasValidTokenArgs): Promise<ReturnValueType<CustomerIsAuthenticated>> {
    const [customerSession, customerDoNotHaveSession] =
    await this.customerSessionRepository.getCustomerByCustomerSession({ sessionId });
    if(customerDoNotHaveSession){
      return [undefined, customerDoNotHaveSession];
    }

    const customerAuth=
    await this.customerAuthRepository.getCustomerAuthToken({
      customerId: customerSession.id,
      provider: 'google',
    });

    if(!customerAuth || customerAuth?.tokenExpiredAt <= new Date()){
      return [{ ...customerSession.customer, isAuthenticated: false }];
    }
    return [{ ...customerAuth.customer, isAuthenticated: true }];
  }
}
