import { Injectable } from '@nestjs/common';

import { PrismaService } from '../../../prisma.service';
import { ReturnValueType } from '@Filters/customError';
import { CustomerAuth } from '@Domains/CustomerAuth';

interface GetCustomerAuthTokenArgs {
  customerId: number;
  provider: 'google';
}

interface UpsertCustomerAuthTokenArgs {
  customerId: number;
  provider: 'google';
  accessToken:string;
  refreshToken:string;
  tokenExpiredAt:Date;
  tokenType:'bearer';
}

export interface CustomerAuthRepositoryInterface {
  getCustomerAuthToken({ customerId, provider }: GetCustomerAuthTokenArgs): Promise<ReturnValueType<CustomerAuth>>;
  upsertCustomerAuthToken({ customerId, provider, accessToken, refreshToken, tokenExpiredAt, tokenType }:
    UpsertCustomerAuthTokenArgs):Promise<ReturnValueType<CustomerAuth>>;
}

@Injectable()
export class CustomerAuthRepository
implements CustomerAuthRepositoryInterface
{
  constructor(private prisma: PrismaService) {}

  async getCustomerAuthToken(
    { customerId, provider }: GetCustomerAuthTokenArgs): Promise<ReturnValueType<CustomerAuth>> {
    const response = await this.prisma.customerOAuth2.findUnique(
      { where: { CustomerOAuthIdentifier: { customerId, provider } }, include: { customer: true } });
    if(!response){
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
    return [
      {
        id: response.customer.id,
        email: response.customer.email,
        uuid: response.customer.uuid,
        token: response.accessToken,
        refreshToken: response.refreshToken,
        expiredAt: response.tokenExpiredAt,
        isAuthenticated: true,
      },
    ];
  }

  async upsertCustomerAuthToken(
    { customerId, provider, accessToken, refreshToken, tokenExpiredAt, tokenType }:
     UpsertCustomerAuthTokenArgs): Promise<ReturnValueType<CustomerAuth>> {
    const response = await this.prisma.customerOAuth2.upsert(
      {
        where: { CustomerOAuthIdentifier: { customerId, provider } }, include: { customer: true },
        create: {
          accessToken,
          refreshToken,
          tokenExpiredAt,
          tokenType,
          customerId,
          provider,
        },
        update: {
          accessToken,
          refreshToken,
          tokenExpiredAt,
          tokenType,
        },
      });

    return [
      {
        id: response.customer.id,
        email: response.customer.email,
        uuid: response.customer.uuid,
        token: response.accessToken,
        tokenType: response.tokenType,
        refreshToken: response.refreshToken,
        expiredAt: response.tokenExpiredAt,
        isAuthenticated: true,
      },
    ];
  }

}
