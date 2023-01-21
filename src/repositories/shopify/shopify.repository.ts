/* eslint-disable no-console */
import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { GraphQLClient } from 'graphql-request';
import { Cart } from '@Domains/Cart';
import { CustomerOrderCount } from '@Domains/CustomerOrderCount';
import { CreateCartMutation, getSdk } from './generated/graphql';
import { GetCustomerOrdersByEmailResponse, GetShopifyOrderByApiId, RetrieveOrdersListResponse, ShopifyGetCustomerRes } from './shopify.interface';
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

interface GetUuidByEmailArgs {
  email: string;
}

export interface GetShopifyOrdersByFromDateArgs {
  fromDate: Date;
}

interface GetShopifyOrderByApiIdArgs {
  apiId: number;
}

export interface ShopifyRepositoryInterface {
  getOrderCount({ shopifyCustomerId }: GetOrderCountArgs): Promise<ReturnValueType<CustomerOrderCount>>;
  createCart({
    discountCode,
    merchandiseId,
    sellingPlanId,
    attributes,
  }: CreateCartArgs): Promise<ReturnValueType<Cart>>;
  getShopifyOrdersByFromDate({ fromDate }:GetShopifyOrdersByFromDateArgs):Promise<ShopifyWebhook[]>;
  getCustomerUuidByEmail({ email }:GetUuidByEmailArgs):Promise<ReturnValueType<string>>;
  getShopifyOrderByApiId({ apiId }:GetShopifyOrderByApiIdArgs): Promise<ReturnValueType<ShopifyWebhook>>;
}

const endpoint = 'https://thetis-tea.myshopify.com/api/2022-01/graphql.json';

@Injectable()
export class ShopifyRepository implements ShopifyRepositoryInterface {
  async getCustomerUuidByEmail({ email }: GetUuidByEmailArgs): Promise<ReturnValueType<string>> {

    const response = await axios.get<GetCustomerOrdersByEmailResponse.RootObject>(
      `https://thetis-tea.myshopify.com/admin/api/2022-01/orders.json?query=email:${email}&status=any`,
      {
        auth: {
          username: process.env.SHOPIFY_API_KEY as string,
          password: process.env.SHOPIFY_API_PASSWORD as string,
        },
      },
    );

    const orders = response?.data?.orders;
    if(!orders || !orders.length){
      return [undefined, { name: 'getCustomerUuidByEmail failed', message: 'No orders were found. Email is invalid' }];
    }
    const attributes:{ name: string, value: string }[] = orders[0].note_attributes;

    let uuid: string | null = null;
    attributes.forEach(note => {
      if (note.name === 'uuid') {
        uuid = note.value;
        return;
      }
    });
    return [uuid];
  }
  async createCart({
    discountCode,
    merchandiseId,
    sellingPlanId,
    attributes,
  }: CreateCartArgs): Promise<ReturnValueType<Cart>> {
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

  async getShopifyOrdersByFromDate({ fromDate }:GetShopifyOrdersByFromDateArgs):
  Promise<ShopifyWebhook[]>{
    console.log('test:', `https://thetis-tea.myshopify.com/admin/api/2022-10/orders.json?status=any&created_at_min=${fromDate.toISOString()}`);
    const response = await axios.get<RetrieveOrdersListResponse.Root>(
      `https://thetis-tea.myshopify.com/admin/api/2022-10/orders.json?status=any&created_at_min=${fromDate.toISOString()}`,
      {
        auth: {
          username: process.env.SHOPIFY_API_KEY as string,
          password: process.env.SHOPIFY_API_PASSWORD as string,
        },
      },
    );
    const shopifyWebhookData:ShopifyWebhook[] = response.data.orders? response.data.orders.map(
      ({ admin_graphql_api_id, name, subtotal_price, note_attributes, line_items, customer }) =>
      {
        return {
          apiId: admin_graphql_api_id,
          orderNumber: name,
          totalPrice: subtotal_price,
          attributes: note_attributes,
          lineItems: line_items.map(({ product_id, sku }) => { return { productId: product_id, sku }; }),
          shopifyCustomer: {
            email: customer.email, id: customer.id,
            phone: customer?.phone, first_name: customer?.first_name, last_name: customer?.last_name,
            default_address: { phone: customer?.default_address?.phone },
          },
        };
      })
      :[];

    return shopifyWebhookData;
  }

  async getShopifyOrderByApiId({ apiId }:GetShopifyOrderByApiIdArgs):
  Promise<ReturnValueType<ShopifyWebhook>>{
    const response = await axios.get<GetShopifyOrderByApiId.RootObject>(
      `https://thetis-tea.myshopify.com//admin/api/2022-07/orders/${apiId}.json?fields=id,line_items,name,total_price,note_attributes,customer,admin_graphql_api_id`,
      {
        auth: {
          username: process.env.SHOPIFY_API_KEY as string,
          password: process.env.SHOPIFY_API_PASSWORD as string,
        },
      },
    );
    if(response.status !== 200){
      return [undefined, { name: 'getShopifyOrderByApiId failed', message: 'apiId is invalid' }];
    }

    const { line_items, name, note_attributes, total_price, customer, admin_graphql_api_id } = response.data.order;
    const shopifyWebhookData:ShopifyWebhook = {
      orderNumber: name,
      apiId: admin_graphql_api_id,
      attributes: note_attributes,
      lineItems: line_items.map(({ sku, product_id }) => { return { sku, productId: product_id }; }),
      totalPrice: total_price,
      shopifyCustomer: customer,
    };

    return [shopifyWebhookData];
  }

}
