import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { ShopifyGetCustomerRes, ShopifyGetProductRes } from './shopify';

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
interface GetOrderCountRes {
  orderCount: number;
}

export interface ShopifyRepoInterface {
  getProduct({ productId }: GetProductArgs): Promise<GetProductRes>;
  getOrderCount({
    shopifyCustomerId,
  }: GetOrderCountArgs): Promise<[GetOrderCountRes, Error]>;
}

@Injectable()
export class ShopifyRepo implements ShopifyRepoInterface {
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
