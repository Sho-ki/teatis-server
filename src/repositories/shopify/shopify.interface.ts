/* eslint-disable @typescript-eslint/no-explicit-any */
export interface ShopifyGetProductRes {
  product: {
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
    variants: {
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
    }[];
    options: {
      id: number;
      product_id: number;
      name: string;
      position: number;
      values: string[];
    }[];
    images: {
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
    }[];
    image: {
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
    };
  };
}

export interface ShopifyGetCustomerRes {
  customer: {
    id: number;
    email: string;
    accepts_marketing: boolean;
    created_at: Date;
    updated_at: Date;
    first_name: string;
    last_name: string;
    orders_count: number;
    state: string;
    total_spent: string;
    last_order_id: number;
    note?: any;
    verified_email: boolean;
    multipass_identifier?: any;
    tax_exempt: boolean;
    phone?: any;
    tags: string;
    last_order_name: string;
    currency: string;
    addresses: {
      id: number;
      customer_id: number;
      first_name: string;
      last_name: string;
      company: string;
      address1: string;
      address2: string;
      city: string;
      province: string;
      country: string;
      zip: string;
      phone: string;
      name: string;
      province_code: string;
      country_code: string;
      country_name: string;
      default: boolean;
    }[];
    accepts_marketing_updated_at: Date;
    marketing_opt_in_level: string;
    tax_exemptions: any[];
    sms_marketing_consent?: any;
    admin_graphql_api_id: string;
    default_address: {
      id: number;
      customer_id: number;
      first_name: string;
      last_name: string;
      company: string;
      address1: string;
      address2: string;
      city: string;
      province: string;
      country: string;
      zip: string;
      phone: string;
      name: string;
      province_code: string;
      country_code: string;
      country_name: string;
      default: boolean;
    };
  };
}
