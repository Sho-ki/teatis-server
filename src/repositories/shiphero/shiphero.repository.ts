// Get a customer's last order

// Get a customer's order histories (get all the products that cannot be sent again, and be sent again)

// Create an original box for a customer

import { Injectable } from '@nestjs/common';
import { GraphQLClient, gql } from 'graphql-request';

import { ShipheroLastOrderNumberProducts } from '../../domains/model/shiphero/shiphero';
import { LastOrderNumberAndProducts } from '../../domains/model/teatisDB/productRepo/productPostPurchaseSurvey';
import { PrismaService } from '../../prisma.service';
import {
  GetLastOrderProductsQuery,
  GetProductDetailQuery,
  getSdk,
} from './generated/graphql';

interface GetLastOrderArgs {
  email: string;
}

export interface GetLastOrderRes {
  products: ProductSku[];
  orderNumber: string;
}

interface ProductSku {
  sku: string;
}

export interface GetVendorsRes {
  id: string;
  name: string;
}

interface GetProductDetailArgs {
  sku: string;
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
  headers: {
    authorization: process.env.SHIPHERO_API_KEY,
  },
});
const sdk = getSdk(client);

export interface ShipheroRepoInterface {
  getLastOrder({ email }: GetLastOrderArgs): Promise<GetLastOrderRes>;

  getProductDetail({ sku }: GetProductDetailArgs): Promise<GetProductDetailRes>;

  getVendors(): Promise<GetVendorsRes[]>;
}

@Injectable()
export class ShipheroRepo implements ShipheroRepoInterface {
  constructor(private prisma: PrismaService) {}

  async getVendors(): Promise<GetVendorsRes[]> {
    let res = await sdk.getVendors();
    let vendors = res.vendors.data.edges;
    return vendors.map((vendor): GetVendorsRes => {
      return { id: vendor.node.id, name: vendor.node.name };
    });
  }

  async getLastOrder({ email }: GetLastOrderArgs): Promise<GetLastOrderRes> {
    let products: GetLastOrderProductsQuery = await sdk.getLastOrderProducts({
      email,
    });
    return {
      orderNumber: products.orders.data.edges[0].node.order_number,
      products: products.orders.data.edges[0].node.line_items.edges.map(
        (item) => {
          return { sku: item.node.sku };
        },
      ),
    } as GetLastOrderRes;
  }

  async getProductDetail({
    sku,
  }: GetProductDetailArgs): Promise<GetProductDetailRes> {
    const productDetail: GetProductDetailQuery = await sdk.getProductDetail({
      sku,
    });
    const data = productDetail.product.data;

    return {
      id: data.id,
      name: data.name,
      sku: data.sku,
      images: data.images.map((image): GetProductDetailImage => {
        return { src: image.src, position: image.position };
      }),
      vendors: data.vendors.map((vendor): GetProductDetailVendor => {
        return { id: vendor.vendor_id, sku: vendor.vendor_sku };
      }),
    };
  }
}
