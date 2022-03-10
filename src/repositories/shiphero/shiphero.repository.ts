// Get a customer's last order

// Get a customer's order histories (get all the products that cannot be sent again, and be sent again)

// Create an original box for a customer

import { Injectable } from '@nestjs/common';
import { GraphQLClient, gql } from 'graphql-request';

import {
  GetLastOrderByEmailQuery,
  GetProductDetailQuery,
  getSdk,
} from './generated/graphql';

interface GetLastOrderArgs {
  email: string;
}

export interface GetLastOrderRes {
  products: GetLastOrderResElement[];
  orderNumber: string;
}

interface GetLastOrderResElement {
  sku: string;
}

export interface GetVendorsRes {
  vendors: Vendor[];
}

interface Vendor {
  id: string;
  name: string;
}

interface GetProductDetailArgs {
  sku: string;
}

interface GetOrderByOrderNumberArgs {
  orderNumber: string;
}

export interface GetOrderByOrderNumberRes {
  products: GetLastOrderResElement[];
  orderNumber: string;
}

export interface GetProductDetailRes {
  id: string;
  name: string;
  sku: string;
  images: GetProductDetailImage[];
  vendors: GetProductDetailVendor[];
}

interface GetProductDetailImage {
  src: string;
  position: number;
}

interface GetProductDetailVendor {
  id: string;
  sku: string;
}

const client = new GraphQLClient('https://public-api.shiphero.com/graphql', {
  headers: <HeadersInit | undefined>{
    authorization: process.env.SHIPHERO_API_KEY,
  },
});
const sdk = getSdk(client);

export interface ShipheroRepoInterface {
  getLastOrder({
    email,
  }: GetLastOrderArgs): Promise<[GetLastOrderRes | null, Error | null]>;

  getProductDetail({
    sku,
  }: GetProductDetailArgs): Promise<[GetProductDetailRes | null, Error | null]>;

  getVendors(): Promise<[GetVendorsRes | null, Error | null]>;

  getOrderByOrderNumber({
    orderNumber,
  }: GetOrderByOrderNumberArgs): Promise<
    [GetOrderByOrderNumberRes | null, Error | null]
  >;
}

@Injectable()
export class ShipheroRepo implements ShipheroRepoInterface {
  async getOrderByOrderNumber({
    orderNumber,
  }: GetOrderByOrderNumberArgs): Promise<[GetOrderByOrderNumberRes, Error]> {
    let res: GetLastOrderByEmailQuery = await sdk.getOrderProductsByOrderNumber(
      {
        orderNumber,
      },
    );

    const items = res?.orders?.data?.edges[0]?.node?.line_items?.edges;

    if (!items) {
      return [
        null,
        {
          name: 'Internal Server Error',
          message: 'getOrderByOrderNumber failed',
        },
      ];
    }
    let products: GetLastOrderResElement[] = [];
    for (let item of items) {
      const itemNode = item?.node;
      if (itemNode) {
        if (itemNode.product.kit) {
          const kitComponents = itemNode.product.kit_components;
          for (let kitComponent of kitComponents) {
            products.push({ sku: kitComponent.sku });
          }
        }
        if (itemNode.sku && itemNode.product_name) {
          products.push({ sku: itemNode.sku });
        }
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

  async getVendors(): Promise<[GetVendorsRes | null, Error | null]> {
    let res = await sdk.getVendors();
    const vendors = res?.vendors?.data?.edges;
    if (!vendors) {
      return [
        null,
        { name: 'Internal Server Error|null', message: 'getVendors failed' },
      ];
    }
    let vendorSet: Vendor[] = [];
    for (let vendor of vendors) {
      const id = vendor?.node?.id;
      const name = vendor?.node?.name;
      if (id && name) {
        vendorSet.push({ id, name });
      }
    }

    return [
      {
        vendors: vendorSet,
      },
      null,
    ];
  }

  async getLastOrder({
    email,
  }: GetLastOrderArgs): Promise<[GetLastOrderRes | null, Error | null]> {
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

    let products: GetLastOrderResElement[] = [];
    for (let item of items) {
      const itemNode = item?.node;
      if (itemNode) {
        if (itemNode.product.kit) {
          const kitComponents = itemNode.product.kit_components;
          for (let kitComponent of kitComponents) {
            products.push({ sku: kitComponent.sku });
          }
        }
        if (itemNode.sku && itemNode.product_name) {
          products.push({ sku: itemNode.sku });
        }
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

  async getProductDetail({
    sku,
  }: GetProductDetailArgs): Promise<
    [GetProductDetailRes | null, Error | null]
  > {
    const res: GetProductDetailQuery = await sdk.getProductDetail({
      sku,
    });
    if (!res || !res.product || !res.product.data) {
      return [
        null,
        { name: 'Internal Server Error', message: 'getProductDetail failed' },
      ];
    }
    const { name, id, sku: productSku, images, vendors } = res.product.data;

    if (!id || !name || !productSku || !vendors) {
      return [
        null,
        {
          name: 'Internal Server Error|null',
          message: 'getProductDetail failed',
        },
      ];
    }

    let imageSet: GetProductDetailImage[] = [];
    if (images) {
      for (let image of images) {
        const src = image?.src,
          position = image?.position;
        if (src && position) {
          imageSet.push({ src, position });
        }
      }
    }

    let vendorSet: GetProductDetailVendor[] = [];
    for (let vendor of vendors) {
      const id = vendor?.vendor_id,
        sku = vendor?.vendor_sku;
      if (id && sku) {
        vendorSet.push({ id, sku });
      }
    }

    return [
      {
        id,
        name,
        sku: productSku,
        images: imageSet,
        vendors: vendorSet,
      },
      null,
    ];
  }
}
