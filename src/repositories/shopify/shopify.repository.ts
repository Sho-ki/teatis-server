import { Injectable } from '@nestjs/common';
import axios from 'axios';

interface GetProductArgs {
  productId: number;
}

export interface GetProductRes {
  id: number;
  title: string;
  sku: string;
  vendor: string;
  images: ProductImage[];
  provider: string;
}

interface ProductImage {
  position: number;
  alt: string | null;
  src: string;
}

export interface ShopifyRepoInterface {
  getProduct({ productId }: GetProductArgs): Promise<GetProductRes>;
}

@Injectable()
export class ShopifyRepo implements ShopifyRepoInterface {
  async getProduct({ productId }: GetProductArgs): Promise<GetProductRes> {
    const response = await axios.get<ShopifyGetProductRes>(
      `https://thetis-tea.myshopify.com/admin/api/2021-10/products/${productId}.json`,
      {
        auth: {
          username: process.env.SHOPIFY_API_KEY,
          password: process.env.SHOPIFY_API_PASSWORD,
        },
      },
    );

    let shopifyProduct: GetProductRes = {
      id: productId,
      title: response.data.product.title,
      vendor: response.data.product.vendor,
      images: [],
      sku: response.data.product.variants[0].sku,
      provider: 'Shopify',
    };

    response.data.product.images.forEach((image: Images) => {
      const productImage: ProductImage = {
        position: image.position,
        alt: image.alt,
        src: image.src,
      };
      shopifyProduct.images.push(productImage);
    });

    return shopifyProduct;
  }
}

interface ShopifyGetProductRes {
  product: ProductContent;
}

interface ProductContent {
  id: number;
  title: string;
  body_html: string;
  vendor: string;
  product_type: string;
  created_at: string;
  handle: string;
  updated_at: string;
  published_at: string;
  template_suffix: string;
  status: string;
  published_scope: string;
  tags: string;
  admin_graphql_api_id: string;
  variants: Variant[];
  options: Option[];
  images: Images[];
  image: Image;
}

interface Variant {
  id: number;
  product_id: number;
  title: string;
  price: string;
  sku: string;
  position: number;
  inventory_policy: string;
  compare_at_price: string;
  fulfillment_service: string;
  inventory_management: string;
  option1: string;
  option2: any;
  option3: any;
  created_at: string;
  updated_at: string;
  taxable: boolean;
  barcode: string;
  grams: number;
  image_id: any;
  weight: number;
  weight_unit: string;
  inventory_item_id: number;
  inventory_quantity: number;
  old_inventory_quantity: number;
  requires_shipping: boolean;
  admin_graphql_api_id: string;
}

interface Option {
  id: number;
  product_id: number;
  name: string;
  position: number;
  values: string[];
}

interface Images {
  id: number;
  product_id: number;
  position: number;
  created_at: string;
  updated_at: string;
  alt: any;
  width: number;
  height: number;
  src: string;
  variant_ids: any[];
  admin_graphql_api_id: string;
}

interface Image {
  id: number;
  product_id: number;
  position: number;
  created_at: string;
  updated_at: string;
  alt: any;
  width: number;
  height: number;
  src: string;
  variant_ids: any[];
  admin_graphql_api_id: string;
}
