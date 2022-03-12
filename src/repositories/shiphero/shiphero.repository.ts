// Get a customer's last order

// Get a customer's order histories (get all the products that cannot be sent again, and be sent again)

// Create an original box for a customer

import { Injectable } from '@nestjs/common';
import { GraphQLClient, gql } from 'graphql-request';

import {
  GetLastOrderByEmailQuery,
  GetProductDetailQuery,
  getSdk,
} from './generated/graphql';

interface GetLastOrderArgs {
  email: string;
}

interface GetLastOrderRes {
  products: GetLastOrderResProduct[];
  orderNumber: string;
}

interface GetLastOrderResProduct {
  sku: string;
}

interface GetOrderByOrderNumberArgs {
  orderNumber: string;
}

interface GetOrderByOrderNumberRes {
  products: GetLastOrderResProduct[];
  orderNumber: string;
}

const endpoint = 'https://public-api.shiphero.com/graphql';

export interface ShipheroRepoInterface {
  getLastOrder({ email }: GetLastOrderArgs): Promise<[GetLastOrderRes, Error]>;

  getOrderByOrderNumber({
    orderNumber,
  }: GetOrderByOrderNumberArgs): Promise<[GetOrderByOrderNumberRes, Error]>;
}

@Injectable()
export class ShipheroRepo implements ShipheroRepoInterface {
  async getOrderByOrderNumber({
    orderNumber,
  }: GetOrderByOrderNumberArgs): Promise<[GetOrderByOrderNumberRes, Error]> {
    const client = new GraphQLClient(endpoint, {
      headers: {
        authorization: process.env.SHIPHERO_API_KEY,
      },
    });
    const sdk = getSdk(client);
    let res: GetLastOrderByEmailQuery = await sdk.getOrderProductsByOrderNumber(
      {
        orderNumber,
      },
    );

    const items = res?.orders?.data?.edges[0]?.node?.line_items?.edges;

    if (!items) {
      return [
        null,
        {
          name: 'Internal Server Error',
          message: 'getOrderByOrderNumber failed',
        },
      ];
    }
    let products: GetLastOrderResProduct[] = [];
    for (let item of items) {
      if (!item) {
        continue;
      }
      const itemNode = item.node;
      if (itemNode.product.kit) {
        const kitComponents = itemNode.product.kit_components;
        for (let kitComponent of kitComponents) {
          products.push({ sku: kitComponent.sku });
        }
      } else {
        products.push({ sku: itemNode.sku });
      }
    }
    return [
      {
        orderNumber,
        products,
      },
      null,
    ];
  }
  async getLastOrder({
    email,
  }: GetLastOrderArgs): Promise<[GetLastOrderRes, Error]> {
    const client = new GraphQLClient(endpoint, {
      headers: {
        authorization: process.env.SHIPHERO_API_KEY,
      },
    });
    const sdk = getSdk(client);

    let res: GetLastOrderByEmailQuery = await sdk.getLastOrderByEmail({
      email,
    });

    const node = res?.orders?.data?.edges[0]?.node;
    const orderNumber = node?.order_number;
    const items = node?.line_items?.edges;

    if (!node || !orderNumber || !items) {
      return [
        null,
        { name: 'Internal Server Error', message: 'getLastOrder failed' },
      ];
    }

    let products: GetLastOrderResProduct[] = [];
    for (let item of items) {
      if (!item) {
        continue;
      }
      const itemNode = item.node;
      if (itemNode.product.kit) {
        const kitComponents = itemNode.product.kit_components;
        for (let kitComponent of kitComponents) {
          products.push({ sku: kitComponent.sku });
        }
      } else {
        products.push({ sku: itemNode.sku });
      }
    }

    return [
      {
        orderNumber,
        products,
      },
      null,
    ];
  }
}
