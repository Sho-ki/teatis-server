import { Injectable } from '@nestjs/common';

import { ReturnValueType } from '@Filters/customError';
import axios from 'axios';
import { OrderQueue } from '../../domains/OrderQueue';

export interface updateOrderWebhookArgs {
  orderNumber: string;
  totalPrice: string;
  customer: { email: string, id: number };
  lineItems: { productId: number }[];
  attributes?: { name: string, value: string }[];
  apiId: string;
}

export interface SystemRepositoryInterface {
  updateOrderWebhookProduct(
    { orderNumber, totalPrice, customer, lineItems, attributes, apiId }: updateOrderWebhookArgs):
    Promise<ReturnValueType<OrderQueue>>;
}

@Injectable()
export class SystemRepository implements SystemRepositoryInterface {
  constructor() {}
  async updateOrderWebhookProduct(
    { orderNumber, totalPrice, customer, lineItems, attributes, apiId }: updateOrderWebhookArgs)
  : Promise<ReturnValueType<OrderQueue>> {
    const serverUrl =process.env.SERVERURL || 'http://localhost:8080';
    const response = await axios(
      `${serverUrl}/api/discovery/order-update-webhook`,
      {
        method: 'POST',
        data: {
          name: orderNumber,
          subtotal_price: totalPrice,
          customer,
          line_items: lineItems,
          note_attributes: attributes,
          admin_graphql_api_id: apiId,
        },
        headers: { 'Content-Type': 'application/json' },
        responseType: 'json',
      },
    );
    if(response.status !== 200){
      throw new Error(response.status + '- updateOrderWebhookProduct failed');
    }

    return [response.data];
  }
}
