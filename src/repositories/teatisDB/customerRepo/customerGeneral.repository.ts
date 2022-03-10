import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { PrismaService } from '../../../prisma.service';

interface GetCustomerArgs {
  email: string;
}

export interface GetCustomerRes {
  id: number;
  email: string;
}

export interface CustomerGeneralRepoInterface {
  getCustomer({ email }: GetCustomerArgs): Promise<[GetCustomerRes, Error]>;
}

@Injectable()
export class CustomerGeneralRepo implements CustomerGeneralRepoInterface {
  constructor(private prisma: PrismaService) {}

  async getCustomer({
    email,
  }: GetCustomerArgs): Promise<[GetCustomerRes, Error]> {
    let customer = await this.prisma.customers.findUnique({
      where: { email },
      select: { id: true, email: true },
    });
    if (customer) {
      return [{ id: customer.id, email: customer.email }, null];
    } else {
      return [
        null,
        { name: 'Internal Server Error', message: 'getCustomer failed' },
      ];
    }
  }
}
