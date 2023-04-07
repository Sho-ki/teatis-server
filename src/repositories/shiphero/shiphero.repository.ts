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
  CreateOrderMutation,
} from './generated/graphql';
import { CustomerOrder } from '@Domains/CustomerOrder';
import { ReturnValueType } from '@Filters/customError';
import { ProductOnHand } from '../../domains/ProductOnHand';
import { Order } from '../../domains/Order';
import { Country } from '@prisma/client';

interface GetLastOrderByUuidArgs {
  email?: string;
  uuid:string;
}

interface GetLastFulfilledOrderArgs {
  email?: string;
  uuid:string;
}

interface CreateCustomerOrderArgs {
  firstName: string;
  lastName:string;
  email:string;
  address: {
    address1: string;
    address2: string | null;
    city: string;
    state: string;
    zip: string;
    country: Country;
  };
  orderNumber?:string;
  products: Pick<Product, 'sku'>[];
  warehouseCode:'CLB-DB';
  uuid:string;
  holdUntilDate:string;
  requiredShipDate:string;
}

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
  holdUntilDate:string;
  requiredShipDate:string;
}

export interface GetOrderByOrderNumberArgs {
  orderNumber: string;
}

const endpoint = 'https://public-api.shiphero.com/graphql';

export interface ShipheroRepositoryInterface {
  updateOrderInformation({ orderId, note, uuid, holdUntilDate, requiredShipDate }:
    UpdateOrderInformationArgs): Promise<Order>;
  getLastCustomerOrder({ email, uuid }: GetLastOrderByUuidArgs): Promise<ReturnValueType<CustomerOrder>>;
  getLastFulfilledOrder({ email, uuid }: GetLastFulfilledOrderArgs): Promise<ReturnValueType<CustomerOrder>>;

  getNoInventoryProducts(): Promise<ReturnValueType<Pick<Product, 'sku'>[]>>;
  getCustomerOrderByOrderNumber({ orderNumber }: GetOrderByOrderNumberArgs): Promise<ReturnValueType<CustomerOrder>>;

  updateCustomerOrder({
    orderId,
    products,
    orderNumber,
    warehouseCode,
  }: UpdateCustomerOrderArgs): Promise<ProductOnHand[]>;

  createCustomerOrder(
    {
      firstName, lastName, email,  address, orderNumber, products, warehouseCode, uuid,
      holdUntilDate, requiredShipDate,
    }:CreateCustomerOrderArgs):Promise<ReturnValueType<ProductOnHand[]>>;

  // getCustomerOrders({ email }: GetCustomerOrdersArgs): Promise<ReturnValueType<CustomerOrder[]>>;
}

@Injectable()
export class ShipheroRepository implements ShipheroRepositoryInterface {

  // shiphero can store only uo to 32 characters
  private createShorterUuid(uuid:string):string{
    return uuid.split('-').join('');
  }

  private getLastSentProducts({ items }):Pick<Product, 'sku'>[]{
    const lastSentProducts :Pick<Product, 'sku'>[]= [];
    for (const item of items) {
      if (!item) continue;

      const itemNode = item?.node;

      if (itemNode?.fulfillment_status !== 'canceled' && itemNode?.sku) {
        lastSentProducts.push({ sku: itemNode.sku });
      }
    }

    return lastSentProducts;
  }

  async createCustomerOrder(
    {
      firstName, lastName, email, address, orderNumber, products, warehouseCode, uuid,
      holdUntilDate, requiredShipDate,
    }:CreateCustomerOrderArgs):Promise<ReturnValueType<ProductOnHand[]>>{
    const client = new GraphQLClient(endpoint,
      { headers: { authorization: process.env.SHIPHERO_API_KEY } as HeadersInit });
    const sdk = getSdk(client);

    const response: CreateOrderMutation = await sdk.createOrder({
      input: {
        order_number: orderNumber || undefined,
        shop_name: 'Manual Order',
        fulfillment_status: 'pending',
        total_tax: '0',
        subtotal: '0',
        total_discounts: '0',
        total_price: '0',
        shipping_lines: {
          title: 'Free shipping',
          price: '0.00',
          carrier: 'Cheapest',
          method: 'Ever',
        },
        shipping_address: {
          first_name: firstName,
          last_name: lastName,
          address1: address.address1,
          address2: address.address2,
          city: address.city,
          state: address.city,
          state_code: address.state,
          zip: address.zip,
          country: address.country,
          country_code: 'US',
          email,
        },
        billing_address: {
          first_name: firstName,
          last_name: lastName,
          address1: address.address1,
          address2: address.address2,
          city: address.city,
          state: address.city,
          state_code: address.state,
          zip: address.zip,
          country: address.country,
          country_code: 'US',
          email,
        },
        line_items: products.map((product, i) => { return {
          sku: product.sku,
          partner_line_item_id: `${product.sku}_${orderNumber}_${i}`,
          quantity: 1,
          price: '0',
        }; }),
        partner_order_id: this.createShorterUuid(uuid),
        hold_until_date: holdUntilDate,
        required_ship_date: requiredShipDate,
      },
    });

    const itemsOnHand:ProductOnHand[] = response.order_create.order.line_items.edges.map(({ node }) => {
      return {
        sku: node.sku,
        onHand: node.product.warehouse_products.find(({ warehouse }) => {
          return warehouse.identifier === warehouseCode;
        }).on_hand,
      };
    });

    return [itemsOnHand];

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

    uuid = this.createShorterUuid(uuid);
    let response: GetLastFulfilledOrderByUuidQuery = await sdk.getLastFulfilledOrderByUuid({ uuid });

    let isFoundOrder = response?.orders?.data?.edges.length > 0;

    if(!isFoundOrder) {
      response =
        await sdk.getLastFulfilledOrderByEmail({ email }) as GetLastFulfilledOrderByEmailQuery;
      isFoundOrder = response?.orders?.data?.edges.length > 0;
    }

    if (!isFoundOrder) {
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
    uuid = this.createShorterUuid(uuid);

    let response: GetLastOrderByUuidQuery = await sdk.getLastOrderByUuid({ uuid });

    let isFoundOrder = response?.orders?.data?.edges.length > 0;

    if(!isFoundOrder) {
      response =
        await sdk.getLastOrderByEmail({ email })as GetLastOrderByEmailQuery;
      isFoundOrder = response?.orders?.data?.edges.length > 0;
    }

    if (!isFoundOrder) {
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

  async updateOrderInformation({ orderId, note, uuid, holdUntilDate, requiredShipDate }:UpdateOrderInformationArgs):
  Promise<Order>{
    const client = new GraphQLClient(endpoint,
      { headers: { authorization: process.env.SHIPHERO_API_KEY } as HeadersInit });
    const sdk = getSdk(client);
    uuid = this.createShorterUuid(uuid);
    const response = await sdk.UpdateOrder({
      input: {
        required_ship_date: requiredShipDate,
        hold_until_date: holdUntilDate,
        order_id: orderId,
        packing_note: note ||'',
        partner_order_id: uuid,

      },
    });
    return {
      orderNumber: response.order_update.order.order_number,
      orderId: response.order_update.request_id,
    };

  }

  async updateCustomerOrder({
    orderId,
    products,
    orderNumber,
    warehouseCode,
  }: UpdateCustomerOrderArgs): Promise<ProductOnHand[]> {
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

    return itemsOnHand;
  }
}
