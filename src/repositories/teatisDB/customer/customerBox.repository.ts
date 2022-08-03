import { Injectable } from '@nestjs/common';
import { Product } from '@Domains/Product';

import { PrismaService } from '../../../prisma.service';
import { Prisma } from '@prisma/client';
import { ReturnValueType } from '../../../filter/customError';

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

export interface CustomerBoxRepositoryInterface {
  getCustomerBoxProducts({
    email,
  }: GetCustomerBoxProductsArgs): Promise<ReturnValueType<Product[]>>;
  deleteCustomerBoxProduct({
    customerId,
  }: DeleteCustomerBoxArgs): Promise<ReturnValueType<void>>;

  postCustomerBoxProduct({
    customerId,
    products,
  }: UpdateCustomerBoxArgs): Promise<ReturnValueType<Product[]>>;
}

@Injectable()
export class CustomerBoxRepository implements CustomerBoxRepositoryInterface {
  constructor(private prisma: PrismaService) {}

  async deleteCustomerBoxProduct({
    customerId,
  }: DeleteCustomerBoxArgs): Promise<ReturnValueType<void>> {
    await this.prisma.customerBoxItems.deleteMany({
      where: {
        customerId,
      },
    });

    return [,];
  }

  async postCustomerBoxProduct({
    customerId,
    products,
  }: UpdateCustomerBoxArgs): Promise<ReturnValueType<Product[]>> {
    let data: Prisma.Enumerable<Prisma.CustomerBoxItemsCreateManyInput> = [];
    for (let product of products) {
      if (product?.id) data.push({ customerId, productId: product?.id });
    }
    const createCustomerBox = await this.prisma.customerBoxItems.createMany({
      data,
    });

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
  }

  async getCustomerBoxProducts({
    email,
  }: GetCustomerBoxProductsArgs): Promise<ReturnValueType<Product[]>> {
    const res = await this.prisma.customers.findUnique({
      where: { email },
      select: {
        customerBoxItems: {
          select: { product: true },
        },
      },
    });
    if (!res?.customerBoxItems) {
      return [
        undefined,
        { name: 'Internal Server Error', message: 'email is invalid' },
      ];
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
  }
}
