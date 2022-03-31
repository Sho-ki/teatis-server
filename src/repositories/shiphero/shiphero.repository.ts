// Get a customer's last order

// Get a customer's order histories (get all the products that cannot be sent again, and be sent again)

// Create an original box for a customer

import { Injectable } from '@nestjs/common';
import { GraphQLClient, gql } from 'graphql-request';
import { Product } from '../../domains/Product';

import {
  GetLastOrderByEmailQuery,
  GetProductDetailQuery,
  GetProductInventryQuery,
  getSdk,
} from './generated/graphql';

interface GetLastOrderArgs {
  email: string;
}

interface GetLastOrderRes {
  products: Pick<Product, 'sku'>[];
  orderNumber: string;
}

interface CreateOrderArgs {
  orderId: string;
  products: Pick<Product, 'sku'>[];
}

interface CreateOrderRes {
  status: string;
}

interface GetOrderByOrderNumberArgs {
  orderNumber: string;
}

interface GetOrderByOrderNumberRes {
  products: Pick<Product, 'sku'>[];
  orderNumber: string;
  orderId: string;
}

interface GetProductDetailArgs {
  sku: string;
}
interface GetProductDetailRes {
  id: string;
  title: string;
  products: Pick<Product, 'sku'>[];
}

interface GetFirstBoxProductsArgs {
  id: string;
}

interface GetFirstBoxProductsRes {
  products: Pick<Product, 'sku'>[];
}

interface GetNonInventryProductsRes {
  skus: string[];
}

const endpoint = 'https://public-api.shiphero.com/graphql';

export interface ShipheroRepoInterface {
  getFirstBoxProducts({
    id,
  }: GetFirstBoxProductsArgs): Promise<[GetFirstBoxProductsRes, Error]>;
  getKitComponents({
    sku,
  }: GetProductDetailArgs): Promise<[GetProductDetailRes, Error]>;
  getLastOrder({ email }: GetLastOrderArgs): Promise<[GetLastOrderRes, Error]>;

  getNonInventryProducts(): Promise<[GetNonInventryProductsRes, Error]>;
  getOrderByOrderNumber({
    orderNumber,
  }: GetOrderByOrderNumberArgs): Promise<[GetOrderByOrderNumberRes, Error]>;

  updateOrder({
    orderId,
    products,
  }: CreateOrderArgs): Promise<[CreateOrderRes, Error]>;
}

@Injectable()
export class ShipheroRepo implements ShipheroRepoInterface {
  async getNonInventryProducts(): Promise<[GetNonInventryProductsRes, Error]> {
    const client = new GraphQLClient(endpoint, {
      headers: {
        authorization: process.env.SHIPHERO_API_KEY,
      },
    });
    const sdk = getSdk(client);

    let res: GetProductInventryQuery = await sdk.getProductInventry();
    const allProducts = res?.products?.data?.edges;
    if (!allProducts) {
      return [
        null,
        {
          name: 'Internal Server Error',
          message: 'Server Side Error: getProductDetail failed',
        },
      ];
    }
    let nonInventrySkus: string[] = [];
    for (let product of allProducts) {
      if (product.node.warehouse_products[0].on_hand <= 5)
        nonInventrySkus.push(product.node.sku);
    }
    return [
      {
        skus: nonInventrySkus,
      },
      null,
    ];
  }

  async getFirstBoxProducts({
    id,
  }: GetFirstBoxProductsArgs): Promise<[GetFirstBoxProductsRes, Error]> {
    const client = new GraphQLClient(endpoint, {
      headers: {
        authorization: process.env.SHIPHERO_API_KEY,
      },
    });
    const sdk = getSdk(client);

    let res: GetProductDetailQuery = await sdk.getFirstBoxProducts({ id });
    const kitComponents = res?.product?.data.kit_components;
    if (!kitComponents) {
      return [
        null,
        {
          name: 'Internal Server Error',
          message: 'Server Side Error: getProductDetail failed',
        },
      ];
    }
    return [
      {
        products: kitComponents.map((component) => {
          return { sku: component.sku };
        }),
      },
      null,
    ];
  }
  async getKitComponents({
    sku,
  }: GetProductDetailArgs): Promise<[GetProductDetailRes, Error]> {
    const client = new GraphQLClient(endpoint, {
      headers: {
        authorization: process.env.SHIPHERO_API_KEY,
      },
    });
    const sdk = getSdk(client);

    let res: GetProductDetailQuery = await sdk.getProductDetail({ sku });
    const { kit_components, name, id } = res?.product?.data;
    if (!kit_components || !name) {
      return [
        null,
        {
          name: 'Internal Server Error',
          message: 'Server Side Error: getProductDetail failed',
        },
      ];
    }
    return [
      {
        id,
        title: name,
        products: kit_components.map((component) => {
          return { sku: component.sku };
        }),
      },
      null,
    ];
  }
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

    const node = res?.orders?.data?.edges[0]?.node;
    const items = node.line_items?.edges;
    const orderId = node.id;

    if (!items) {
      return [
        null,
        {
          name: 'Internal Server Error',
          message: 'getOrderByOrderNumber failed',
        },
      ];
    }
    let products: Pick<Product, 'sku'>[] = [];
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
        orderId,
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

    let products: Pick<Product, 'sku'>[] = [];
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

  async updateOrder({
    orderId,
    products,
  }: CreateOrderArgs): Promise<[CreateOrderRes, Error]> {
    const client = new GraphQLClient(endpoint, {
      headers: {
        authorization: process.env.SHIPHERO_API_KEY,
      },
    });

    let orderProducts = '';
    for (let product of products) {
      orderProducts += String(`{
        sku: "${product.sku}",
        partner_line_item_id: "${product.sku}_${orderId}",
        quantity: 1,
        price: "0",
     }, `);
    }

    const mutation = gql`
    mutation {
      order_add_line_items (
        data: {	
          order_id: "${orderId}"
          line_items: [${orderProducts}]
               
        }
      ) {
        request_id
      }
    }
  `;

    const data = await client.request(mutation);

    return [{ status: 'Success' }, null];
  }
}
