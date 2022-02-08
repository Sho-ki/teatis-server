// Get a customer's last order

// Get a customer's order histories (get all the products that cannot be sent again, and be sent again)

// Create an original box for a customer

import { Injectable } from '@nestjs/common';
import { GraphQLClient, gql } from 'graphql-request';
import {
  GetLastOrderProductsQuery,
  GetProductDetailQuery,
  getSdk,
} from './generated/graphql';

interface ShipheroRepoInterface {
  getLastOrderProductsByEmail(
    email: string,
  ): Promise<GetLastOrderProductsQuery[]>;
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

  async getLastOrderProductsByEmail(
    email: string,
  ): Promise<GetLastOrderProductsQuery[]> {
    const lastOrderedproducts: GetLastOrderProductsQuery =
      await sdk.getLastOrderProducts({
        email,
      });
    const lastproducts =
      lastOrderedproducts.orders.data.edges[0].node.line_items.edges;
    let productSkus = [];
    for (let lastproduct of lastproducts) {
      const productDetail: GetProductDetailQuery = await sdk.getProductDetail({
        sku: lastproduct.node.sku,
      });
      const data = productDetail.product.data;
      let images: string[];

      if (data.product_note && data.product_note.includes('\n')) {
        images = data.product_note.split('\n').filter((imageUrl) => {
          return imageUrl.length > 0;
        });
      } else if (data.product_note && !data.product_note.includes('\n')) {
        images = [data.product_note];
      }

      productSkus.push({
        id: data.id,
        sku: data.sku,
        name: data.name,
        images,
      });
    }

    // const lastOrderedproducts: GetLastOrderproductsQuery =
    //   await sdk.getLastOrderproducts({ sku: kitSku });
    // console.log(lastOrderedproducts);
    // const kitComponents = lastOrderedproducts.product.data.kit_components;

    // let items = [];
    // for (let component of kitComponents) {
    //   const itemDetail: GetproductDetailQuery = await sdk.getproductDetail({
    //     sku: component.sku,
    //   });
    //   items.push(itemDetail.product.data);
    // }

    return productSkus;
  }
}
