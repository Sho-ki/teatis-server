import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { GraphQLClient } from 'graphql-request';
import {
  CreateCartMutation,
  CreateCartMutationVariables,
  getSdk,
} from './generated/graphql';
import {
  ShopifyGetCustomerRes,
  ShopifyGetProductRes,
} from './shopify.interface';

interface GetProductArgs {
  productId: number;
}

export interface GetProductRes {
  id: number;
  title: string;
  sku: string;
}

interface GetOrderCountArgs {
  shopifyCustomerId: number;
}
export interface GetOrderCountRes {
  orderCount: number;
}

interface CreateCartArgs {
  merchandiseId: string;
  sellingPlanId: string;
  uuid: string;
}
export interface CreateCartRes {
  checkoutUrl: string;
}

export interface ShopifyRepoInterface {
  getProduct({ productId }: GetProductArgs): Promise<GetProductRes>;
  getOrderCount({
    shopifyCustomerId,
  }: GetOrderCountArgs): Promise<[GetOrderCountRes, Error]>;
  createCart({
    merchandiseId,
    sellingPlanId,
    uuid,
  }: CreateCartArgs): Promise<[CreateCartRes, Error]>;
}

const endpoint = 'https://thetis-tea.myshopify.com/api/2022-01/graphql.json';

@Injectable()
export class ShopifyRepo implements ShopifyRepoInterface {
  async createCart({
    merchandiseId,
    sellingPlanId,
    uuid,
  }: CreateCartArgs): Promise<[CreateCartRes, Error]> {
    const client = new GraphQLClient(endpoint, {
      headers: {
        'X-Shopify-Storefront-Access-Token': 'd710761c009d16ed459f7014d119093c',
      },
    });
    const sdk = getSdk(client);

    const res: CreateCartMutation = await sdk.CreateCart({
      input: {
        attributes: [{ key: 'uuid', value: uuid }],
        lines: [{ sellingPlanId, merchandiseId, quantity: 1 }],
      },
    });
    return [{ checkoutUrl: res.cartCreate.cart.checkoutUrl }, null];
  }

  async getProduct({ productId }: GetProductArgs): Promise<GetProductRes> {
    const response = await axios.get<ShopifyGetProductRes>(
      `https://thetis-tea.myshopify.com/admin/api/2021-10/products/${productId}.json`,
      {
        auth: {
          username: process.env.SHOPIFY_API_KEY,
          password: process.env.SHOPIFY_API_PASSWORD,
        },
      },
    );

    let shopifyProduct: GetProductRes = {
      id: productId,
      title: response.data.product.title,
      sku: response.data.product.variants[0].sku,
    };

    return shopifyProduct;
  }

  async getOrderCount({
    shopifyCustomerId,
  }: GetOrderCountArgs): Promise<[GetOrderCountRes, Error]> {
    const getOrderCountRes = await axios.get<ShopifyGetCustomerRes>(
      `https://thetis-tea.myshopify.com/admin/api/2022-01/customers/${shopifyCustomerId}.json`,
      {
        auth: {
          username: process.env.SHOPIFY_API_KEY,
          password: process.env.SHOPIFY_API_PASSWORD,
        },
      },
    );
    if (!getOrderCountRes.data) {
      return [
        null,
        {
          name: 'Internal Server Error',
          message: 'Server Side Error: getOrderCount failed',
        },
      ];
    }

    return [{ orderCount: getOrderCountRes.data.customer.orders_count }, null];
  }
}
