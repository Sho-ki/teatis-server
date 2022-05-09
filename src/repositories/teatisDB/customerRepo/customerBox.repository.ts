import { Injectable } from '@nestjs/common';
import { Product } from '@Domains/Product';

import { PrismaService } from '../../../prisma.service';
import { Prisma } from '@prisma/client';

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
  }: GetCustomerBoxProductsArgs): Promise<[GetCustomerBoxProductsRes?, Error?]>;
  deleteCustomerBox({
    customerId,
  }: DeleteCustomerBoxArgs): Promise<[DeleteCustomerBoxRes?, Error?]>;

  postCustomerBox({
    customerId,
    products,
  }: UpdateCustomerBoxArgs): Promise<[UpdateCustomerBoxRes?, Error?]>;
}

@Injectable()
export class CustomerBoxRepo implements CustomerBoxRepoInterface {
  constructor(private prisma: PrismaService) {}

  async deleteCustomerBox({
    customerId,
  }: DeleteCustomerBoxArgs): Promise<[DeleteCustomerBoxRes?, Error?]> {
    try {
      const res = await this.prisma.customerBoxItems.deleteMany({
        where: {
          customerId,
        },
      });

      return [{ deletedCount: res.count }];
    } catch (e) {
      return [
        undefined,
        {
          name: 'Internal Server Error',
          message: 'Server Side Error: deleteCustomerBox failed',
        },
      ];
    }
  }

  async postCustomerBox({
    customerId,
    products,
  }: UpdateCustomerBoxArgs): Promise<[UpdateCustomerBoxRes?, Error?]> {
    try {
      let data: Prisma.Enumerable<Prisma.CustomerBoxItemsCreateManyInput> = [];
      for (let product of products) {
        if (product?.id) data.push({ customerId, productId: product?.id });
      }
      const res = await this.prisma.customerBoxItems.createMany({
        data,
      });

      if (!res.count) {
        throw new Error();
      }
      return [{ postCount: res.count }];
    } catch (e) {
      return [
        undefined,
        {
          name: 'Internal Server Error',
          message: 'Server Side Error: postCustomerBox failed',
        },
      ];
    }
  }

  async getCustomerBoxProducts({
    email,
  }: GetCustomerBoxProductsArgs): Promise<
    [GetCustomerBoxProductsRes?, Error?]
  > {
    try {
      const res = await this.prisma.customers.findUnique({
        where: { email },
        select: {
          customerBoxItems: {
            select: { product: true },
          },
        },
      });
      if (!res.customerBoxItems) {
        throw new Error();
      }
      return [
        {
          products: !res.customerBoxItems.length
            ? []
            : res.customerBoxItems.map((boxItem) => {
                return { sku: boxItem.product.externalSku };
              }),
        },
      ];
    } catch (e) {
      return [
        undefined,
        {
          name: 'Internal Server Error',
          message: 'Server Side Error: getCustomerBoxProducts failed',
        },
      ];
    }
  }
}
