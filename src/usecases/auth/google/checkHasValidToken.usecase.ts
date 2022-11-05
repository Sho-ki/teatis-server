import {  Inject, Injectable } from '@nestjs/common';

import { ReturnValueType } from '@Filters/customError';
import { CustomerSessionRepositoryInterface } from '@Repositories/teatisDB/customer/customerSession.repository';
import { CustomerAuthRepositoryInterface } from '@Repositories/teatisDB/customer/customerAuth.repository';
import { CustomerAuth } from '@Domains/CustomerAuth';

interface CheckHasValidTokenArgs {
  sessionId:string;
}

export interface CheckHasValidTokenUsecaseInterface {
  checkHasValidToken( {  sessionId }:CheckHasValidTokenArgs): Promise<ReturnValueType<CustomerAuth>>;
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

  async checkHasValidToken( { sessionId }:CheckHasValidTokenArgs): Promise<ReturnValueType<CustomerAuth>> {
    const [customerSession, getCustomerBySessionId] =
    await this.customerSessionRepository.getCustomerByCustomerSession({ sessionId });
    if(getCustomerBySessionId){
      return [undefined, getCustomerBySessionId];
    }
    if(!customerSession.id){
      return [
        {
          id: undefined,
          email: undefined,
          uuid: undefined,
          token: undefined,
          refreshToken: undefined,
          expiredAt: undefined,
          isAuthenticated: false,
        },
        undefined,
      ];
    }

    const [customerAuth, getCustomerAuthError] =
    await this.customerAuthRepository.getCustomerAuthToken({
      customerId: customerSession.id,
      provider: 'google',
    });

    if(getCustomerAuthError){
      return [undefined, getCustomerAuthError];
    }
    return [customerAuth];
  }
}
