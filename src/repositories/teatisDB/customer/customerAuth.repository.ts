import { Inject, Injectable } from '@nestjs/common';

import { PrismaService } from '../../../prisma.service';
import { CustomerAuth } from '../../../domains/CustomerAuth';
import { Transactionable } from '../../utils/transactionable.interface';
import { PrismaClient, Prisma } from '@prisma/client';

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

export interface CustomerAuthRepositoryInterface extends Transactionable{
  getCustomerAuthToken({ customerId, provider }: GetCustomerAuthTokenArgs): Promise<CustomerAuth>;
  upsertCustomerAuthToken({ customerId, provider, accessToken, refreshToken, tokenExpiredAt, tokenType }:
    UpsertCustomerAuthTokenArgs):Promise<CustomerAuth>;
}

@Injectable()
export class CustomerAuthRepository
implements CustomerAuthRepositoryInterface
{
  private originalPrismaClient : PrismaClient;
  constructor(@Inject(PrismaService) private prisma: PrismaClient | Prisma.TransactionClient) {}
  setPrismaClient(prisma: Prisma.TransactionClient): CustomerAuthRepositoryInterface {
    this.originalPrismaClient = this.prisma as PrismaClient;
    this.prisma = prisma;
    return this;
  }

  setDefaultPrismaClient() {
    this.prisma = this.originalPrismaClient;
  }

  async getCustomerAuthToken(
    { customerId, provider }: GetCustomerAuthTokenArgs): Promise<CustomerAuth> {
    const response = await this.prisma.customerOAuth2.findUnique(
      { where: { CustomerOAuthIdentifier: { customerId, provider } }, include: { customer: true } });
    return response;
  }

  async upsertCustomerAuthToken(
    { customerId, provider, accessToken, refreshToken, tokenExpiredAt, tokenType }:
     UpsertCustomerAuthTokenArgs): Promise<CustomerAuth> {
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

    return response;
  }

}
