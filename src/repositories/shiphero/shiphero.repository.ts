import { Injectable } from '@nestjs/common';
import { GraphQLClient } from 'graphql-request';
import { Product } from '@Domains/Product';

import {
  GetLastOrderByUuidQuery,
  GetLastFulfilledOrderByEmailQuery,
  GetLastFulfilledOrderByUuidQuery,
  GetLastOrderByEmailQuery,
  GetProductInventoryQuery,
  getSdk,
  GetOrderByOrderNumberQuery,
} from './generated/graphql';
import { CustomerOrder } from '@Domains/CustomerOrder';
import { ReturnValueType } from '@Filters/customError';
import { ProductOnHand } from '../../domains/ProductOnHand';

interface GetLastOrderByUuidArgs {
  email?: string;
  uuid:string;
}

interface GetLastFulfilledOrderArgs {
  email?: string;
  uuid:string;
}

// interface GetCustomerOrdersArgs {
//   email: string;
// }

interface UpdateCustomerOrderArgs {
  orderId: string;
  products: Pick<Product, 'sku'>[];
  orderNumber: string;
  warehouseCode:'CLB-DB';
}

interface UpdateOrderInformationArgs {
  orderId: string;
  note?: string;
  uuid:string;
}

export interface GetOrderByOrderNumberArgs {
  orderNumber: string;
}

const endpoint = 'https://public-api.shiphero.com/graphql';

export interface ShipheroRepositoryInterface {
  updateOrderInformation({ orderId, note, uuid }: UpdateOrderInformationArgs): Promise<[void?, Error?]>;
  getLastCustomerOrder({ email, uuid }: GetLastOrderByUuidArgs): Promise<ReturnValueType<CustomerOrder>>;
  getLastFulfilledOrder({ email, uuid }: GetLastFulfilledOrderArgs): Promise<ReturnValueType<CustomerOrder>>;

  getNoInventoryProducts(): Promise<ReturnValueType<Pick<Product, 'sku'>[]>>;
  getCustomerOrderByOrderNumber({ orderNumber }: GetOrderByOrderNumberArgs): Promise<ReturnValueType<CustomerOrder>>;

  updateCustomerOrder({
    orderId,
    products,
    orderNumber,
    warehouseCode,
  }: UpdateCustomerOrderArgs): Promise<ReturnValueType<ProductOnHand[]>>;

  // getCustomerOrders({ email }: GetCustomerOrdersArgs): Promise<ReturnValueType<CustomerOrder[]>>;
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
    const response: GetOrderByOrderNumberQuery =
      await sdk.getOrderByOrderNumber({ orderNumber });

    const node = response?.orders?.data?.edges[0]?.node;
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
  // TODO: use only uuid from Jan, 2023
  async getLastFulfilledOrder({ email, uuid }: GetLastFulfilledOrderArgs): Promise<ReturnValueType<CustomerOrder>>{
    const client = new GraphQLClient(endpoint,
      { headers: { authorization: process.env.SHIPHERO_API_KEY } as HeadersInit });
    const sdk = getSdk(client);

    const response: GetLastFulfilledOrderByEmailQuery|GetLastFulfilledOrderByUuidQuery = email?
      await sdk.getLastFulfilledOrderByEmail({ email }): await sdk.getLastFulfilledOrderByUuid({ uuid });

    const hasOrdered = response?.orders?.data?.edges.length > 0;
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

    const node = response?.orders?.data?.edges[0]?.node;
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

  // TODO: use only uuid from Jan, 2023
  async getLastCustomerOrder({ email, uuid }: GetLastOrderByUuidArgs): Promise<ReturnValueType<CustomerOrder>> {
    const client = new GraphQLClient(endpoint,
      { headers: { authorization: process.env.SHIPHERO_API_KEY } as HeadersInit });
    const sdk = getSdk(client);

    const response: GetLastOrderByEmailQuery|GetLastOrderByUuidQuery = email?
      await sdk.getLastOrderByEmail({ email }): await sdk.getLastOrderByUuid({ uuid });

    const hasOrdered = response?.orders?.data?.edges.length > 0;
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

    const node = response?.orders?.data?.edges[0]?.node;
    const orderNumber = node.order_number;
    const items = node.line_items?.edges;
    const orderId = node.id;
    const orderDate = node.order_date;
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

  // // not in use
  // async getCustomerOrders({ email }: GetCustomerOrdersArgs): Promise<ReturnValueType<CustomerOrder[]>> {
  //   const client = new GraphQLClient(endpoint,
  //     { headers: { authorization: process.env.SHIPHERO_API_KEY } as HeadersInit });
  //   const sdk = getSdk(client);

  //   const res: GetLastOrderByEmailQuery = await sdk.getCustomerOrderByEmail({ email });

  //   const customerOrders: CustomerOrder[] = [];
  //   for (const edge of res?.orders?.data?.edges || []) {
  //     const node = edge?.node;
  //     const orderNumber = node?.order_number;
  //     const orderId = node?.id;
  //     const orderDate = node?.order_date;
  //     const items = node?.line_items?.edges;

  //     if (!node || !items || !orderId || !orderDate) {
  //       return [
  //         undefined,
  //         {
  //           name: 'Internal Server Error',
  //           message: 'email is invalid',
  //         },
  //       ];
  //     }

  //     const products: Pick<Product, 'sku'>[] = [];
  //     for (const item of items) {
  //       if (!item) {
  //         continue;
  //       }

  //       const itemNode = item?.node;
  //       if (
  //         itemNode?.product?.kit &&
  //         itemNode?.fulfillment_status !== 'canceled'
  //       ) {
  //         const kitComponents = itemNode?.product?.kit_components || [];
  //         for (const component of kitComponents) {
  //           if (component?.sku) {
  //             products.push({ sku: component.sku });
  //           }
  //         }
  //       } else if (
  //         itemNode?.fulfillment_status !== 'canceled' &&
  //         itemNode?.sku
  //       ) {
  //         products.push({ sku: itemNode.sku });
  //       }
  //     }
  //     customerOrders.push({ products, orderNumber, orderDate, orderId });
  //   }

  //   return [customerOrders];
  // }

  async updateOrderInformation({ orderId, note, uuid }:UpdateOrderInformationArgs):
  Promise<[void?, Error?]>{
    const client = new GraphQLClient(endpoint,
      { headers: { authorization: process.env.SHIPHERO_API_KEY } as HeadersInit });
    const sdk = getSdk(client);

    const holdUntilDate = new Date();
    holdUntilDate.setHours(holdUntilDate.getHours() + 24);
    await sdk.UpdateOrder({
      input: {
        hold_until_date: holdUntilDate.toISOString().replace(/T/, ' ').replace(/\..+/, ''),
        order_id: orderId,
        packing_note: note ||'',
        partner_order_id: uuid,

      },
    });
    return [];
  }

  async updateCustomerOrder({
    orderId,
    products,
    orderNumber,
    warehouseCode,
  }: UpdateCustomerOrderArgs): Promise<ReturnValueType<ProductOnHand[]>> {
    const client = new GraphQLClient(endpoint,
      { headers: { authorization: process.env.SHIPHERO_API_KEY } as HeadersInit });

    const sdk = getSdk(client);

    const response = await sdk.AddOrderLineItems(
      {
        data: {
          order_id: orderId,
          line_items: products.map(({ sku }, i) => {
            return {
              sku,
              partner_line_item_id: `${sku}_${orderNumber}_${i}`,
              quantity: 1,
              price: '0',
            };
          }),
        },
      });
    const itemsOnHand:ProductOnHand[] = response.order_add_line_items.order.line_items.edges.map(({ node }) => {
      return {
        sku: node.sku,
        onHand: node.product.warehouse_products.find(({ warehouse }) => {
          return warehouse.identifier === warehouseCode;
        }).on_hand,
      };
    });

    return [itemsOnHand];
  }
}
