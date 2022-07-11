import { Injectable } from '@nestjs/common';
import { GraphQLClient, gql } from 'graphql-request';
import { Product } from '@Domains/Product';

import {
  GetLastOrderByEmailQuery,
  GetProductInventoryQuery,
  getSdk,
} from './generated/graphql';
import { CustomerOrder } from '@Domains/CustomerOrder';

interface GetLastOrderArgs {
  email: string;
}

interface GetCustomerOrdersArgs {
  email: string;
}

interface CreateOrderArgs {
  orderId: string;
  products: Pick<Product, 'sku'>[];
  orderNumber: string;
}

export interface GetOrderByOrderNumberArgs {
  orderNumber: string;
}

const endpoint = 'https://public-api.shiphero.com/graphql';

export interface ShipheroRepositoryInterface {
  getLastCustomerOrder({
    email,
  }: GetLastOrderArgs): Promise<[CustomerOrder?, Error?]>;

  getNoInventoryProducts(): Promise<[Pick<Product, 'sku'>[]?, Error?]>;
  getCustomerOrderByOrderNumber({
    orderNumber,
  }: GetOrderByOrderNumberArgs): Promise<[CustomerOrder?, Error?]>;

  updateCustomerOrder({
    orderId,
    products,
    orderNumber,
  }: CreateOrderArgs): Promise<[CustomerOrder?, Error?]>;

  getCustomerOrders({
    email,
  }: GetCustomerOrdersArgs): Promise<[CustomerOrder[]?, Error?]>;
}

@Injectable()
export class ShipheroRepository implements ShipheroRepositoryInterface {
  async getNoInventoryProducts(): Promise<[Pick<Product, 'sku'>[]?, Error?]> {
    try {
      const client = new GraphQLClient(endpoint, {
        headers: {
          authorization: process.env.SHIPHERO_API_KEY,
        } as HeadersInit,
      });
      const sdk = getSdk(client);

      let res: GetProductInventoryQuery = await sdk.getProductInventory();
      const allProducts = res?.products?.data?.edges;
      if (!allProducts) {
        throw new Error();
      }
      let nonInventorySkus: Pick<Product, 'sku'>[] = [];
      for (let product of allProducts) {
        const wareHouseProducts = product?.node?.warehouse_products;
        const onHand = wareHouseProducts ? wareHouseProducts[0]?.on_hand : 0;
        const productSku = product?.node?.sku;
        if (onHand && onHand <= 5 && productSku) {
          nonInventorySkus.push({ sku: productSku });
        }
      }
      return [nonInventorySkus];
    } catch (e) {
      return [
        undefined,
        {
          name: 'Internal Server Error',
          message: 'Server Side Error: getNoInventoryProducts failed',
        },
      ];
    }
  }

  async getCustomerOrderByOrderNumber({
    orderNumber,
  }: GetOrderByOrderNumberArgs): Promise<[CustomerOrder?, Error?]> {
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
      const orderDate = node?.order_date;

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
          orderDate,
        },
      ];
    } catch (e) {
      return [
        undefined,
        {
          name: 'Internal Server Error',
          message: 'Server Side Error: getCustomerOrderByOrderNumber failed',
        },
      ];
    }
  }
  async getLastCustomerOrder({
    email,
  }: GetLastOrderArgs): Promise<[CustomerOrder?, Error?]> {
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

      const hasOrdered = res?.orders?.data?.edges.length > 0;
      const node = res?.orders?.data?.edges[0]?.node;
      const orderNumber = node?.order_number;
      const items = node?.line_items?.edges;
      const orderId = node?.id;
      const orderDate = node?.order_date;

      if (!hasOrdered) {
        return [
          {
            orderNumber: undefined,
            products: [],
            orderDate: undefined,
            orderId: undefined,
          },
        ];
      }
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

      return [{ orderNumber, products, orderDate, orderId }];
    } catch (e) {
      return [
        undefined,
        {
          name: 'Internal Server Error',
          message: 'Server Side Error: getLastCustomerOrder failed',
        },
      ];
    }
  }

  async getCustomerOrders({
    email,
  }: GetCustomerOrdersArgs): Promise<[CustomerOrder[]?, Error?]> {
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

      let customerOrders: CustomerOrder[] = [];
      for (let edge of res?.orders?.data?.edges || []) {
        const node = edge?.node;
        const orderNumber = node?.order_number;
        const orderId = node?.id;
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
        customerOrders.push({ products, orderNumber, orderDate, orderId });
      }

      return [customerOrders];
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

  async updateCustomerOrder({
    orderId,
    products,
    orderNumber,
  }: CreateOrderArgs): Promise<[CustomerOrder?, Error?]> {
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

      return [{ orderId, orderNumber, products }];
    } catch (e) {
      return [
        undefined,
        {
          name: 'Internal Server Error',
          message: 'Server Side Error: updateCustomerOrder failed',
        },
      ];
    }
  }
}
