import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { GraphQLClient } from 'graphql-request';
import { Cart } from '@Domains/Cart';
import { CustomerOrderCount } from '@Domains/CustomerOrderCount';
import { CreateCartMutation, getSdk } from './generated/graphql';
import { RetrieveOrdersListResponse, ShopifyGetCustomerRes } from './shopify.interface';
import { ReturnValueType } from '../../filter/customError';
import { ShopifyWebhook } from '../../domains/ShopifyWebhook';

interface GetOrderCountArgs {
  shopifyCustomerId: number;
}

interface CreateCartArgs {
  discountCode?: string;
  merchandiseId: string;
  sellingPlanId?: string;
  attributes: { key: string, value: string }[];
}

interface GetShopifyWebhooksArgs {
  fromDate: Date;
}

export interface ShopifyRepositoryInterface {
  getOrderCount({ shopifyCustomerId }: GetOrderCountArgs): Promise<ReturnValueType<CustomerOrderCount>>;
  createCart({
    discountCode,
    merchandiseId,
    sellingPlanId,
    attributes,
  }: CreateCartArgs): Promise<ReturnValueType<Cart>>;
  getShopifyWebhooks({ fromDate }:GetShopifyWebhooksArgs):Promise<ReturnValueType<ShopifyWebhook[]>>;
}

const endpoint = 'https://thetis-tea.myshopify.com/api/2022-01/graphql.json';

@Injectable()
export class ShopifyRepository implements ShopifyRepositoryInterface {
  async createCart({
    discountCode,
    merchandiseId,
    sellingPlanId,
    attributes,
  }: CreateCartArgs): Promise<ReturnValueType<Cart>> {
    console.log(sellingPlanId);
    const client = new GraphQLClient(endpoint, { headers: { 'X-Shopify-Storefront-Access-Token': process.env.SHOPIFY_STOREFRONT_TOKEN } });
    const sdk = getSdk(client);
    const res: CreateCartMutation = await sdk.CreateCart({
      input: {
        discountCodes: [discountCode],
        attributes,
        lines: [{ sellingPlanId, merchandiseId, quantity: 1 }],
      },
    });

    if (!res?.cartCreate?.cart?.checkoutUrl) {
      return [
        undefined,
        {
          name: 'Internal Server Error',
          message: '\'Couldn\'t create your cart',
        },
      ];
    }

    return [{ checkoutUrl: res.cartCreate.cart.checkoutUrl }];
  }

  async getOrderCount({ shopifyCustomerId }: GetOrderCountArgs): Promise<ReturnValueType<CustomerOrderCount>> {
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
      return [
        undefined,
        {
          name: 'Internal Server Error',
          message: 'shopifyCustomerId is invalid',
        },
      ];
    }
    return [{ orderCount, email }];
  }
  async getShopifyWebhooks({ fromDate }:GetShopifyWebhooksArgs):Promise<ReturnValueType<ShopifyWebhook[]>>{
    const response = await axios.get<RetrieveOrdersListResponse.Root>(
      `https://thetis-tea.myshopify.com/admin/api/2022-10/orders.json?status=any&created_at_min=${fromDate.toDateString()}`,
      {
        auth: {
          username: process.env.SHOPIFY_API_KEY as string,
          password: process.env.SHOPIFY_API_PASSWORD as string,
        },
      },
    );
    if(response.status !== 200){
      throw new Error(response.status + '- getShopifyWebhooks failed');
    }
    const shopifyWebhookData:ShopifyWebhook[] = response.data.orders? response.data.orders.map(
      ({ admin_graphql_api_id, name, subtotal_price, note_attributes, line_items, customer }) =>
      {
        return {
          apiId: admin_graphql_api_id,
          orderNumber: name,
          totalPrice: subtotal_price,
          attributes: note_attributes,
          lineItems: line_items.map(({ product_id }) => { return { productId: product_id }; }),
          shopifyCustomer: {
            email: customer.email, id: customer.id,
            phone: customer?.phone, first_name: customer?.first_name, last_name: customer?.last_name,
          },
        };
      })
      :[];

    return [shopifyWebhookData];
  }

}
