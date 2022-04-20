import { Injectable } from '@nestjs/common';
import { Product } from '../../../domains/Product';

import { PrismaService } from '../../../prisma.service';

export interface DeleteCustomerBoxArgs {
  customerId: number;
}
export interface DeleteCustomerBoxRes {
  deletedCount: number;
}

export interface GetCustomerBoxProductsArgs {
  email: string;
}
export interface GetCustomerBoxProductsRes {
  products: Pick<Product, 'sku'>[];
}

export interface UpdateCustomerBoxArgs {
  customerId: number;
  products: Partial<Product>[];
}

export interface UpdateCustomerBoxRes {
  postCount: number;
}

export interface CustomerBoxRepoInterface {
  getCustomerBoxProducts({
    email,
  }: GetCustomerBoxProductsArgs): Promise<[GetCustomerBoxProductsRes, Error]>;
  deleteCustomerBox({
    customerId,
  }: DeleteCustomerBoxArgs): Promise<[DeleteCustomerBoxRes, Error]>;

  postCustomerBox({
    customerId,
    products,
  }: UpdateCustomerBoxArgs): Promise<[UpdateCustomerBoxRes, Error]>;
}

@Injectable()
export class CustomerBoxRepo implements CustomerBoxRepoInterface {
  constructor(private prisma: PrismaService) {}

  async deleteCustomerBox({
    customerId,
  }: DeleteCustomerBoxArgs): Promise<[DeleteCustomerBoxRes, Error]> {
    let res = await this.prisma.customerBoxItems.deleteMany({
      where: {
        customerId,
      },
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
    products,
  }: UpdateCustomerBoxArgs): Promise<[UpdateCustomerBoxRes, Error]> {
    let res = await this.prisma.customerBoxItems.createMany({
      data: products.map((product) => {
        return { customerId, productId: product.id };
      }),
    });

    if (!res.count) {
      return [
        null,
        {
          name: 'Internal Server Error',
          message: 'Server Side Error: postCustomerBox failed',
        },
      ];
    }
    return [{ postCount: res.count }, null];
  }

  async getCustomerBoxProducts({
    email,
  }: GetCustomerBoxProductsArgs): Promise<[GetCustomerBoxProductsRes, Error]> {
    const getCustomerBoxProductsRes = await this.prisma.customers.findUnique({
      where: { email },
      select: {
        customerBoxItems: {
          select: { product: true },
        },
      },
    });
    if (getCustomerBoxProductsRes.customerBoxItems.length <= 0) {
      return [
        {
          products: [],
        },
        null,
      ];
    }
    return [
      {
        products: getCustomerBoxProductsRes.customerBoxItems.map((boxItem) => {
          return { sku: boxItem.product.externalSku };
        }),
      },
      null,
    ];
  }
}
