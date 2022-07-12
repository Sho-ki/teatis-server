import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { GraphQLClient } from 'graphql-request';
import { Cart } from '@Domains/Cart';
import { CustomerOrderCount } from '@Domains/CustomerOrderCount';
import { CreateCartMutation, getSdk } from './generated/graphql';
import { ShopifyGetCustomerRes } from './shopify.interface';

interface GetOrderCountArgs {
  shopifyCustomerId: number;
}

interface CreateCartArgs {
  merchandiseId: string;
  sellingPlanId: string;
  attributes: { key: string; value: string }[];
}

export interface ShopifyRepositoryInterface {
  getOrderCount({
    shopifyCustomerId,
  }: GetOrderCountArgs): Promise<[CustomerOrderCount?, Error?]>;
  createCart({
    merchandiseId,
    sellingPlanId,
    attributes,
  }: CreateCartArgs): Promise<[Cart?, Error?]>;
}

const endpoint = 'https://thetis-tea.myshopify.com/api/2022-01/graphql.json';

@Injectable()
export class ShopifyRepository implements ShopifyRepositoryInterface {
  async createCart({
    merchandiseId,
    sellingPlanId,
    attributes,
  }: CreateCartArgs): Promise<[Cart?, Error?]> {
    const client = new GraphQLClient(endpoint, {
      headers: {
        'X-Shopify-Storefront-Access-Token': 'd710761c009d16ed459f7014d119093c',
      },
    });
    const sdk = getSdk(client);

    const res: CreateCartMutation = await sdk.CreateCart({
      input: {
        attributes,
        lines: [{ sellingPlanId, merchandiseId, quantity: 1 }],
      },
    });

    return [{ checkoutUrl: res.cartCreate.cart.checkoutUrl }];
  }

  async getOrderCount({
    shopifyCustomerId,
  }: GetOrderCountArgs): Promise<[CustomerOrderCount?, Error?]> {
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

    return [{ orderCount: orderCount, email }];
  }
}
