import { Injectable } from '@nestjs/common';

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
    if (!customer) {
      return [
        null,
        {
          name: 'Internal Server Error',
          message: 'Server Side Error: getCustomer failed',
        },
      ];
    }
    return [{ id: customer.id, email: customer.email }, null];
  }
}
