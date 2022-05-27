import { Injectable } from '@nestjs/common';
import { Product } from '@Domains/Product';

import axios from 'axios';
import { Token } from '@Domains/Token';

export interface GetOrderByOrderNumberArgs {
  orderNumber: string;
}

export interface ShipheroAuthRepoInterface {
  getNewToken(): Promise<[Token?, Error?]>;
}

@Injectable()
export class ShipheroAuthRepo implements ShipheroAuthRepoInterface {
  async getNewToken(): Promise<[Token?, Error?]> {
    try {
      const res = await axios('https://public-api.shiphero.com/auth/refresh', {
        method: 'post',
        headers: { 'Content-Type': 'application/json' },
        data: {
          refresh_token: process.env.SHIPHERO_API_REFRESH_TOKEN,
        },
      });
      const newToken = await res.data.access_token;
      return [newToken];
    } catch (e) {
      return [
        undefined,
        {
          name: 'Internal Server Error',
          message: 'Server Side Error: getNewToken failed',
        },
      ];
    }
  }
}
