import { Injectable } from '@nestjs/common';
import { Product } from '@Domains/Product';

import { PrismaService } from '../../../prisma.service';
import { Prisma } from '@prisma/client';

export interface DeleteCustomerBoxArgs {
  customerId: number;
}

export interface GetCustomerBoxProductsArgs {
  email: string;
}

export interface UpdateCustomerBoxArgs {
  customerId: number;
  products: Partial<Product>[];
}

export interface CustomerBoxRepoInterface {
  getCustomerBoxProducts({
    email,
  }: GetCustomerBoxProductsArgs): Promise<[Product[]?, Error?]>;
  deleteCustomerBoxProduct({
    customerId,
  }: DeleteCustomerBoxArgs): Promise<[void?, Error?]>;

  postCustomerBoxProduct({
    customerId,
    products,
  }: UpdateCustomerBoxArgs): Promise<[Product[]?, Error?]>;
}

@Injectable()
export class CustomerBoxRepo implements CustomerBoxRepoInterface {
  constructor(private prisma: PrismaService) {}

  async deleteCustomerBoxProduct({
    customerId,
  }: DeleteCustomerBoxArgs): Promise<[void?, Error?]> {
    try {
      await this.prisma.customerBoxItems.deleteMany({
        where: {
          customerId,
        },
      });

      return [];
    } catch (e) {
      return [
        undefined,
        {
          name: 'Internal Server Error',
          message: 'Server Side Error: deleteCustomerBoxProduct failed',
        },
      ];
    }
  }

  async postCustomerBoxProduct({
    customerId,
    products,
  }: UpdateCustomerBoxArgs): Promise<[Product[]?, Error?]> {
    try {
      let data: Prisma.Enumerable<Prisma.CustomerBoxItemsCreateManyInput> = [];
      for (let product of products) {
        if (product?.id) data.push({ customerId, productId: product?.id });
      }
      const createCustomerBox = await this.prisma.customerBoxItems.createMany({
        data,
      });
      if (!createCustomerBox.count) {
        throw new Error();
      }

      const customerProducts = await this.prisma.product.findMany({
        where: { OR: products },
        select: { id: true, externalSku: true, name: true, label: true },
      });

      const productsRes: Product[] = customerProducts.map(
        ({ id, externalSku, name, label }) => {
          return { id, name, label, sku: externalSku };
        },
      );
      return [productsRes];
    } catch (e) {
      return [
        undefined,
        {
          name: 'Internal Server Error',
          message: 'Server Side Error: postCustomerBoxProduct failed',
        },
      ];
    }
  }

  async getCustomerBoxProducts({
    email,
  }: GetCustomerBoxProductsArgs): Promise<[Product[]?, Error?]> {
    try {
      const res = await this.prisma.customers.findUnique({
        where: { email },
        select: {
          customerBoxItems: {
            select: { product: true },
          },
        },
      });
      if (!res?.customerBoxItems) {
        throw new Error();
      }
      const products: Product[] = !res.customerBoxItems.length
        ? []
        : res.customerBoxItems.map((boxItem) => {
            return {
              sku: boxItem.product.externalSku,
              id: boxItem.product.id,
              name: boxItem.product.name,
              label: boxItem.product.label,
            };
          });
      return [products];
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
