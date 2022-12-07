import { ShopifyWebhookApiId } from './ShopifyWebhookApiId';

export interface ShopifyWebhook extends ShopifyWebhookApiId {
  orderNumber: string;
  attributes: {name:string, value:string}[];
  lineItems: {productId:number}[];
  totalPrice: string;
  shopifyCustomer : {email:string, id:number, phone?:string, first_name?:string, last_name?:string};
}
