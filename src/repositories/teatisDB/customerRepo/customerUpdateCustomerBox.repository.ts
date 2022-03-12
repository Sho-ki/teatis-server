import { Injectable } from '@nestjs/common';

import { PrismaService } from '../../../prisma.service';

interface DeleteCustomerBoxArgs {
  customerId: number;
}
interface DeleteCustomerBoxRes {
  deletedCount: number;
}

interface UpdateCustomerBoxArgs {
  customerId: number;
  dbProducts: { id: number; externalSku: string }[];
}

interface UpdateCustomerBoxRes {
  postCount: number;
}

export interface CustomerUpdateCustomerBoxRepoInterface {
  deleteCustomerBox({
    customerId,
  }: DeleteCustomerBoxArgs): Promise<[DeleteCustomerBoxRes, Error]>;

  postCustomerBox({
    customerId,
    dbProducts,
  }: UpdateCustomerBoxArgs): Promise<[UpdateCustomerBoxRes, Error]>;
}

@Injectable()
export class CustomerUpdateCustomerBoxRepo
  implements CustomerUpdateCustomerBoxRepoInterface
{
  constructor(private prisma: PrismaService) {}

  async deleteCustomerBox({
    customerId,
  }: DeleteCustomerBoxArgs): Promise<[DeleteCustomerBoxRes, Error]> {
    let res = await this.prisma.customerBoxItems.deleteMany({
      where: { customerId },
    });

    if (!res) {
      return [
        null,
        {
          name: 'Internal Server Error',
          message: 'Server Side Error: deleteCustomerBox failed',
        },
      ];
    }
    return [{ deletedCount: res.count }, null];
  }

  async postCustomerBox({
    customerId,
    dbProducts,
  }: UpdateCustomerBoxArgs): Promise<[UpdateCustomerBoxRes, Error]> {
    let res = await this.prisma.customerBoxItems.createMany({
      data: dbProducts.map((dbProductId) => {
        return { customerId, productId: dbProductId.id };
      }),
    });
    if (res?.count >= 0) {
      return [{ postCount: res.count }, null];
    } else {
      return [
        null,
        {
          name: 'Internal Server Error',
          message: 'Server Side Error: postCustomerBox failed',
        },
      ];
    }
  }
}
