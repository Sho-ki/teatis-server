import { Injectable } from '@nestjs/common';
import axios from 'axios';

export interface AnalyzePreferenceArgs {
  products: CustomerShippableProduct[];
  necessary_responces: number;
  user_fav_categories: number[];
}

export interface CustomerShippableProduct {
  product_id: number;
  product_sku: string;
  flavor_id: number;
  category_id: number;
  is_sent_1: 0 | 1;
  avg_category_score: number;
  avg_flavor_score: number;
}
interface AnalyzePreferenceRes {
  is_success: 'true' | 'false';
  products: {
    product_id: number;
    product_sku: string;
  }[];
}

export interface AnalyzePreferenceRepoInterface {
  getAnalyzedProducts({
    products,
    necessary_responces,
    user_fav_categories,
  }: AnalyzePreferenceArgs): Promise<[AnalyzePreferenceRes?, Error?]>;
}

@Injectable()
export class AnalyzePreferenceRepo implements AnalyzePreferenceRepoInterface {
  async getAnalyzedProducts(
    data: AnalyzePreferenceArgs,
  ): Promise<[AnalyzePreferenceRes?, Error?]> {
    try {
      const response = await axios.post<AnalyzePreferenceRes>(
        `https://us-central1-teatis-discovery.cloudfunctions.net/product_distribution_optimizer_v101`,
        data,
      );

      return [response.data];
    } catch (e) {
      return [
        undefined,
        {
          name: 'Internal Server Error',
          message: 'Server Side Error: getAnalyzedProducts failed',
        },
      ];
    }
  }
}
