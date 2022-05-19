import { Injectable } from '@nestjs/common';
import { GraphQLClient, gql } from 'graphql-request';
import { Product } from '@Domains/Product';
import { Status } from '@Domains/Status';

import {
  GetLastOrderByEmailQuery,
  GetProductDetailQuery,
  GetProductInventryQuery,
  getSdk,
} from './generated/graphql';

interface GetLastOrderArgs {
  email: string;
}

export interface GetLastOrderRes {
  products: Pick<Product, 'sku'>[];
  orderNumber: string;
}

interface GetCustomerOrdersArgs {
  email: string;
}

export interface GetCustomerOrdersRes {
  orders: CustomerOrders[];
}

interface CustomerOrders {
  products: Pick<Product, 'sku'>[];
  orderNumber: string;
  orderDate: string;
}

interface CreateOrderArgs {
  orderId: string;
  products: Pick<Product, 'sku'>[];
  orderNumber: string;
}

export interface UpdateOrderRes extends Status {}

export interface GetOrderByOrderNumberArgs {
  orderNumber: string;
}

export interface GetOrderByOrderNumberRes {
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
  }: GetFirstBoxProductsArgs): Promise<[GetFirstBoxProductsRes?, Error?]>;
  getKitComponents({
    sku,
  }: GetProductDetailArgs): Promise<[GetProductDetailRes?, Error?]>;
  getLastOrder({
    email,
  }: GetLastOrderArgs): Promise<[GetLastOrderRes?, Error?]>;

  getNonInventryProducts(): Promise<[Pick<Product, 'sku'>[]?, Error?]>;
  getOrderByOrderNumber({
    orderNumber,
  }: GetOrderByOrderNumberArgs): Promise<[GetOrderByOrderNumberRes?, Error?]>;

  updateOrder({
    orderId,
    products,
    orderNumber,
  }: CreateOrderArgs): Promise<[UpdateOrderRes?, Error?]>;

  getCustomerOrders({
    email,
  }: GetCustomerOrdersArgs): Promise<[GetCustomerOrdersRes?, Error?]>;
}

@Injectable()
export class ShipheroRepo implements ShipheroRepoInterface {
  async getNonInventryProducts(): Promise<[Pick<Product, 'sku'>[]?, Error?]> {
    try {
      const client = new GraphQLClient(endpoint, {
        headers: {
          authorization: process.env.SHIPHERO_API_KEY,
        } as HeadersInit,
      });
      const sdk = getSdk(client);

      let res: GetProductInventryQuery = await sdk.getProductInventry();
      const allProducts = res?.products?.data?.edges;
      if (!allProducts) {
        throw new Error();
      }
      let nonInventrySkus: Pick<Product, 'sku'>[] = [];
      for (let product of allProducts) {
        const wareHouseProducts = product?.node?.warehouse_products;
        const onHand = wareHouseProducts ? wareHouseProducts[0]?.on_hand : 0;
        const productSku = product?.node?.sku;
        if (onHand && onHand <= 5 && productSku) {
          nonInventrySkus.push({ sku: productSku });
        }
      }
      return [nonInventrySkus];
    } catch (e) {
      return [
        undefined,
        {
          name: 'Internal Server Error',
          message: 'Server Side Error: getNonInventryProducts failed',
        },
      ];
    }
  }

  async getFirstBoxProducts({
    id,
  }: GetFirstBoxProductsArgs): Promise<[GetFirstBoxProductsRes?, Error?]> {
    try {
      const client = new GraphQLClient(endpoint, {
        headers: {
          authorization: process.env.SHIPHERO_API_KEY,
        } as HeadersInit,
      });
      const sdk = getSdk(client);

      const res: GetProductDetailQuery = await sdk.getFirstBoxProducts({ id });
      const kitComponents = res?.product?.data?.kit_components;
      if (!kitComponents) {
        throw new Error();
      }

      return [
        {
          products: kitComponents.map((component: { sku: string }) => {
            return { sku: component.sku };
          }),
        },
      ];
    } catch (e) {
      return [
        undefined,
        {
          name: 'Internal Server Error',
          message: 'Server Side Error: getFirstBoxProducts failed',
        },
      ];
    }
  }
  async getKitComponents({
    sku,
  }: GetProductDetailArgs): Promise<[GetProductDetailRes?, Error?]> {
    try {
      const client = new GraphQLClient(endpoint, {
        headers: {
          authorization: process.env.SHIPHERO_API_KEY,
        } as HeadersInit,
      });
      const sdk = getSdk(client);

      const res: GetProductDetailQuery = await sdk.getProductDetail({ sku });
      const productData = res?.product?.data;
      const name = productData?.name;
      const id = productData?.id;
      const kitComponents = productData?.kit_components;
      if (!kitComponents || !name || !id) {
        throw new Error();
      }
      return [
        {
          id,
          title: name,
          products: kitComponents.map((component: { sku: string }) => {
            return { sku: component.sku };
          }),
        },
      ];
    } catch (e) {
      return [
        undefined,
        {
          name: 'Internal Server Error',
          message: 'Server Side Error: getKitComponents failed',
        },
      ];
    }
  }
  async getOrderByOrderNumber({
    orderNumber,
  }: GetOrderByOrderNumberArgs): Promise<[GetOrderByOrderNumberRes?, Error?]> {
    try {
      const client = new GraphQLClient(endpoint, {
        headers: {
          authorization: process.env.SHIPHERO_API_KEY,
        } as HeadersInit,
      });
      const sdk = getSdk(client);
      const res: GetLastOrderByEmailQuery =
        await sdk.getOrderProductsByOrderNumber({
          orderNumber,
        });

      const node = res?.orders?.data?.edges[0]?.node;
      const items = node?.line_items?.edges;
      const orderId = node?.id;

      if (!items || !node || !orderId) {
        throw new Error();
      }
      let products: Pick<Product, 'sku'>[] = [];
      for (let item of items) {
        if (!item) {
          continue;
        }

        const itemNode = item?.node;
        if (
          itemNode?.product?.kit &&
          itemNode?.fulfillment_status !== 'canceled'
        ) {
          const kitComponents = itemNode?.product?.kit_components || [];
          for (let component of kitComponents) {
            if (component?.sku) {
              products.push({ sku: component.sku });
            }
          }
        } else if (
          itemNode?.fulfillment_status !== 'canceled' &&
          itemNode?.sku
        ) {
          products.push({ sku: itemNode.sku });
        }
      }
      return [
        {
          orderNumber,
          products,
          orderId,
        },
      ];
    } catch (e) {
      return [
        undefined,
        {
          name: 'Internal Server Error',
          message: 'Server Side Error: getOrderByOrderNumber failed',
        },
      ];
    }
  }
  async getLastOrder({
    email,
  }: GetLastOrderArgs): Promise<[GetLastOrderRes?, Error?]> {
    try {
      const client = new GraphQLClient(endpoint, {
        headers: {
          authorization: process.env.SHIPHERO_API_KEY,
        } as HeadersInit,
      });
      const sdk = getSdk(client);

      const res: GetLastOrderByEmailQuery = await sdk.getLastOrderByEmail({
        email,
      });

      const node = res?.orders?.data?.edges[0]?.node;
      const orderNumber = node?.order_number;
      const items = node?.line_items?.edges;

      if (!node || !orderNumber || !items) {
        throw new Error();
      }

      let products: Pick<Product, 'sku'>[] = [];
      for (let item of items) {
        if (!item) {
          continue;
        }

        const itemNode = item?.node;
        if (
          itemNode?.product?.kit &&
          itemNode?.fulfillment_status !== 'canceled'
        ) {
          const kitComponents = itemNode?.product?.kit_components || [];
          for (let component of kitComponents) {
            if (component?.sku) {
              products.push({ sku: component.sku });
            }
          }
        } else if (
          itemNode?.fulfillment_status !== 'canceled' &&
          itemNode?.sku
        ) {
          products.push({ sku: itemNode.sku });
        }
      }

      return [{ orderNumber, products }];
    } catch (e) {
      return [
        undefined,
        {
          name: 'Internal Server Error',
          message: 'Server Side Error: getLastOrder failed',
        },
      ];
    }
  }

  async getCustomerOrders({
    email,
  }: GetCustomerOrdersArgs): Promise<[GetCustomerOrdersRes?, Error?]> {
    try {
      const client = new GraphQLClient(endpoint, {
        headers: {
          authorization: process.env.SHIPHERO_API_KEY,
        } as HeadersInit,
      });
      const sdk = getSdk(client);

      let res: GetLastOrderByEmailQuery = await sdk.getCustomerOrderByEmail({
        email,
      });

      let customerOrders: CustomerOrders[] = [];
      for (let edge of res?.orders?.data?.edges || []) {
        const node = edge?.node;
        const orderNumber = node?.order_number;
        const orderDate = node?.order_date;
        const items = node?.line_items?.edges;

        if (!node || !orderNumber || !items || !orderDate) {
          throw new Error();
        }

        let products: Pick<Product, 'sku'>[] = [];
        for (let item of items) {
          if (!item) {
            continue;
          }

          const itemNode = item?.node;
          if (
            itemNode?.product?.kit &&
            itemNode?.fulfillment_status !== 'canceled'
          ) {
            const kitComponents = itemNode?.product?.kit_components || [];
            for (let component of kitComponents) {
              if (component?.sku) {
                products.push({ sku: component.sku });
              }
            }
          } else if (
            itemNode?.fulfillment_status !== 'canceled' &&
            itemNode?.sku
          ) {
            products.push({ sku: itemNode.sku });
          }
        }
        customerOrders.push({ products, orderNumber, orderDate });
      }

      return [{ orders: customerOrders }];
    } catch (e) {
      return [
        undefined,
        {
          name: 'Internal Server Error',
          message: 'Server Side Error: getCustomerOrders failed',
        },
      ];
    }
  }

  async updateOrder({
    orderId,
    products,
    orderNumber,
  }: CreateOrderArgs): Promise<[UpdateOrderRes?, Error?]> {
    try {
      const client = new GraphQLClient(endpoint, {
        headers: {
          authorization: process.env.SHIPHERO_API_KEY,
        } as HeadersInit,
      });

      let orderProducts = '';
      let ct = 1;
      for (let product of products) {
        orderProducts += String(`{
        sku: "${product.sku}",
        partner_line_item_id: "${product.sku}_${orderNumber}_#${ct}",
        quantity: 1,
        price: "0",
     }, `);
        ct++;
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
      await client.request(mutation);

      return [{ status: 'Success' }];
    } catch (e) {
      return [
        undefined,
        {
          name: 'Internal Server Error',
          message: 'Server Side Error: updateOrder failed',
        },
      ];
    }
  }
}
