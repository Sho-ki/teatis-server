export interface ShopifyWebhook {
  orderNumber: string;
  apiId: string;
  attributes: {name:string, value:string}[];
  lineItems: {productId:number, sku:string}[];
  totalPrice: string;
  shopifyCustomer : {email:string; id:number; phone?:string; first_name?:string; last_name?:string;
    default_address?:{phone?:string}; };
}
