// Get a customer's last order

// Get a customer's order histories (get all the products that cannot be sent again, and be sent again)

// Create an original box for a customer

import { Injectable } from '@nestjs/common';
import { GraphQLClient, gql } from 'graphql-request';
import {
  GetItemDetailQuery,
  GetLastOrderItemsQuery,
  GetLastOrderKitQuery,
  getSdk,
} from './generated/graphql';

interface ShipheroRepoInterface {
  getLastOrderItemsByEmail(email: string): Promise<GetItemDetailQuery[]>;
}

const client = new GraphQLClient('https://public-api.shiphero.com/graphql', {
  headers: {
    authorization: process.env.SHIPHERO_API_KEY,
  },
});
const sdk = getSdk(client);

@Injectable()
export class ShipheroRepo implements ShipheroRepoInterface {
  constructor() {}

  async getLastOrderItemsByEmail(email: string): Promise<GetItemDetailQuery[]> {
    const lastOrderedKit: GetLastOrderKitQuery = await sdk.getLastOrderKit({
      email,
    });
    const kitSku =
      lastOrderedKit.orders.data.edges[0].node.line_items.edges[0].node.sku;

    const lastOrderedItems: GetLastOrderItemsQuery =
      await sdk.getLastOrderItems({ sku: kitSku });
    const kitComponents = lastOrderedItems.product.data.kit_components;

    let items = [];
    for (let component of kitComponents) {
      const itemDetail: GetItemDetailQuery = await sdk.getItemDetail({
        sku: component.sku,
      });
      items.push(itemDetail.product.data);
    }

    return items;
  }
}
