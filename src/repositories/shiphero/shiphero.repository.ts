import { Injectable } from '@nestjs/common';
import { GraphQLClient, gql } from 'graphql-request';
import { Product } from '@Domains/Product';

import {
  GetLastOrderByEmailQuery,
  GetProductInventoryQuery,
  getSdk,
} from './generated/graphql';
import { CustomerOrder } from '@Domains/CustomerOrder';
import { ReturnValueType } from '@Filters/customError';

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

interface UpdateOrderHoldUntilDateArgs {
  orderId: string;
}

export interface GetOrderByOrderNumberArgs {
  orderNumber: string;
}

const endpoint = 'https://public-api.shiphero.com/graphql';

export interface ShipheroRepositoryInterface {
  updateOrderHoldUntilDate({ orderId }: UpdateOrderHoldUntilDateArgs): Promise<[void?, Error?]>;
  getLastCustomerOrder({ email }: GetLastOrderArgs): Promise<ReturnValueType<CustomerOrder>>;

  getNoInventoryProducts(): Promise<ReturnValueType<Pick<Product, 'sku'>[]>>;
  getCustomerOrderByOrderNumber({ orderNumber }: GetOrderByOrderNumberArgs): Promise<ReturnValueType<CustomerOrder>>;

  updateCustomerOrder({
    orderId,
    products,
    orderNumber,
  }: CreateOrderArgs): Promise<ReturnValueType<CustomerOrder>>;

  getCustomerOrders({ email }: GetCustomerOrdersArgs): Promise<ReturnValueType<CustomerOrder[]>>;
}

@Injectable()
export class ShipheroRepository implements ShipheroRepositoryInterface {

  private getLastSentProducts({ items }):Pick<Product, 'sku'>[]{
    const lastSentProducts :Pick<Product, 'sku'>[]= [];
    for (const item of items) {
      if (!item) continue;

      const itemNode = item?.node;
      if (
        itemNode?.product?.kit &&
        itemNode?.fulfillment_status !== 'canceled'
      ) {
        const kitComponents = itemNode?.product?.kit_components || [];
        for (const component of kitComponents) {
          if (component?.sku) {
            lastSentProducts.push({ sku: component.sku });
          }
        }
      } else if (itemNode?.fulfillment_status !== 'canceled' && itemNode?.sku) {
        lastSentProducts.push({ sku: itemNode.sku });
      }
    }

    return lastSentProducts;
  }
  async getNoInventoryProducts(): Promise<ReturnValueType<Pick<Product, 'sku'>[]>> {
    const client = new GraphQLClient(endpoint,
      { headers: { authorization: process.env.SHIPHERO_API_KEY } as HeadersInit });
    const sdk = getSdk(client);

    const res: GetProductInventoryQuery = await sdk.getProductInventory();
    const allProducts = res?.products?.data?.edges;

    const nonInventorySkus: Pick<Product, 'sku'>[] = [];
    for (const product of allProducts) {
      const wareHouseProducts = product?.node?.warehouse_products;
      const onHand = wareHouseProducts ? wareHouseProducts[0]?.on_hand : 0;
      const productSku = product?.node?.sku;
      if (onHand && onHand <= 5 && productSku) {
        nonInventorySkus.push({ sku: productSku });
      }
    }
    return [nonInventorySkus];
  }

  async getCustomerOrderByOrderNumber({ orderNumber }: GetOrderByOrderNumberArgs):
  Promise<ReturnValueType<CustomerOrder>>
  {
    const client = new GraphQLClient(endpoint,
      { headers: { authorization: process.env.SHIPHERO_API_KEY } as HeadersInit });
    const sdk = getSdk(client);
    const res: GetLastOrderByEmailQuery =
      await sdk.getOrderProductsByOrderNumber({ orderNumber });

    const node = res?.orders?.data?.edges[0]?.node;
    const items = node?.line_items?.edges;
    const orderId = node?.id;
    const orderDate = node?.order_date;

    if (!node || !items || !orderId || !orderDate) {
      return [
        undefined,
        {
          name: 'Internal Server Error',
          message: 'order number is invalid',
        },
      ];
    }
    const products: Pick<Product, 'sku'>[] = this.getLastSentProducts({ items });

    return [
      {
        orderNumber,
        products,
        orderId,
        orderDate,
      },
    ];
  }
  async getLastCustomerOrder({ email }: GetLastOrderArgs): Promise<ReturnValueType<CustomerOrder>> {
    const client = new GraphQLClient(endpoint,
      { headers: { authorization: process.env.SHIPHERO_API_KEY } as HeadersInit });
    const sdk = getSdk(client);

    const res: GetLastOrderByEmailQuery = await sdk.getLastOrderByEmail({ email });

    const hasOrdered = res?.orders?.data?.edges.length > 0;
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

    const node = res?.orders?.data?.edges[0]?.node;
    const orderNumber = node?.order_number;
    const items = node?.line_items?.edges;
    const orderId = node?.id;
    const orderDate = node?.order_date;
    if (!node || !items || !orderId || !orderDate) {
      return [
        undefined,
        {
          name: 'Internal Server Error',
          message: 'email is invalid',
        },
      ];
    }

    const products: Pick<Product, 'sku'>[] = this.getLastSentProducts({ items });

    return [{ orderNumber, products, orderDate, orderId }];
  }

  async getCustomerOrders({ email }: GetCustomerOrdersArgs): Promise<ReturnValueType<CustomerOrder[]>> {
    const client = new GraphQLClient(endpoint,
      { headers: { authorization: process.env.SHIPHERO_API_KEY } as HeadersInit });
    const sdk = getSdk(client);

    const res: GetLastOrderByEmailQuery = await sdk.getCustomerOrderByEmail({ email });

    const customerOrders: CustomerOrder[] = [];
    for (const edge of res?.orders?.data?.edges || []) {
      const node = edge?.node;
      const orderNumber = node?.order_number;
      const orderId = node?.id;
      const orderDate = node?.order_date;
      const items = node?.line_items?.edges;

      if (!node || !items || !orderId || !orderDate) {
        return [
          undefined,
          {
            name: 'Internal Server Error',
            message: 'email is invalid',
          },
        ];
      }

      const products: Pick<Product, 'sku'>[] = [];
      for (const item of items) {
        if (!item) {
          continue;
        }

        const itemNode = item?.node;
        if (
          itemNode?.product?.kit &&
          itemNode?.fulfillment_status !== 'canceled'
        ) {
          const kitComponents = itemNode?.product?.kit_components || [];
          for (const component of kitComponents) {
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
  }

  async updateOrderHoldUntilDate({ orderId }:UpdateOrderHoldUntilDateArgs):
  Promise<[void?, Error?]>{
    const client = new GraphQLClient(endpoint,
      { headers: { authorization: process.env.SHIPHERO_API_KEY } as HeadersInit });
    const holdUntilDate = new Date();
    holdUntilDate.setHours(holdUntilDate.getHours() + 24);
    const mutation = gql`
        mutation {
          order_update(
            data: {
              order_id: "${orderId}"
              hold_until_date: "${holdUntilDate.toISOString().replace(/T/, ' ').replace(/\..+/, '')}"
            }
          ) {
            request_id
            complexity
            order {
              hold_until_date
            }
          }
        }`;
    await client.request(mutation);
    return [];
  }

  async updateCustomerOrder({
    orderId,
    products,
    orderNumber,
  }: CreateOrderArgs): Promise<ReturnValueType<CustomerOrder>> {
    const client = new GraphQLClient(endpoint,
      { headers: { authorization: process.env.SHIPHERO_API_KEY } as HeadersInit });

    let orderProducts = '';
    let ct = 1;
    for (const product of products) {
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
  }
}
