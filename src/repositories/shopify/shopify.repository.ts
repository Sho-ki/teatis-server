import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { GraphQLClient } from 'graphql-request';
import { Cart } from '@Domains/Cart';
import { CustomerOrderCount } from '@Domains/CustomerOrderCount';
import {
  CreateCartMutation,
  CreateCartMutationVariables,
  getSdk,
} from './generated/graphql';
import { ShopifyGetCustomerRes } from './shopify.interface';

interface GetOrderCountArgs {
  shopifyCustomerId: number;
}

interface CreateCartArgs {
  merchandiseId: string;
  sellingPlanId: string;
  uuid: string;
}

export interface ShopifyRepoInterface {
  getOrderCount({
    shopifyCustomerId,
  }: GetOrderCountArgs): Promise<[CustomerOrderCount?, Error?]>;
  createCart({
    merchandiseId,
    sellingPlanId,
    uuid,
  }: CreateCartArgs): Promise<[Cart?, Error?]>;
}

const endpoint = 'https://thetis-tea.myshopify.com/api/2022-01/graphql.json';

@Injectable()
export class ShopifyRepo implements ShopifyRepoInterface {
  async createCart({
    merchandiseId,
    sellingPlanId,
    uuid,
  }: CreateCartArgs): Promise<[Cart?, Error?]> {
    try {
      const client = new GraphQLClient(endpoint, {
        headers: {
          'X-Shopify-Storefront-Access-Token':
            'd710761c009d16ed459f7014d119093c',
        },
      });
      const sdk = getSdk(client);

      const res: CreateCartMutation = await sdk.CreateCart({
        input: {
          attributes: [{ key: 'uuid', value: uuid }],
          lines: [{ sellingPlanId, merchandiseId, quantity: 1 }],
        },
      });
      if (!res?.cartCreate?.cart?.checkoutUrl) {
        throw new Error();
      }
      return [{ checkoutUrl: res.cartCreate.cart.checkoutUrl }];
    } catch (e) {
      return [
        undefined,
        {
          name: 'Internal Server Error',
          message: 'Server Side Error: createCart failed',
        },
      ];
    }
  }

  async getOrderCount({
    shopifyCustomerId,
  }: GetOrderCountArgs): Promise<[CustomerOrderCount?, Error?]> {
    try {
      const res = await axios.get<ShopifyGetCustomerRes>(
        `https://thetis-tea.myshopify.com/admin/api/2022-01/customers/${shopifyCustomerId}.json`,
        {
          auth: {
            username: process.env.SHOPIFY_API_KEY as string,
            password: process.env.SHOPIFY_API_PASSWORD as string,
          },
        },
      );
      const orderCount = res?.data?.customer?.orders_count;
      const email = res?.data?.customer?.email;
      if (!orderCount || !email) {
        throw new Error();
      }

      return [{ orderCount: orderCount, email }];
    } catch (e) {
      return [
        undefined,
        {
          name: 'Internal Server Error',
          message: 'Server Side Error: getOrderCount failed',
        },
      ];
    }
  }
}
