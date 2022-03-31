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
  cooking_method_ids: number[];
  is_send_last_time: boolean;
}
interface AnalyzePreferenceRes {
  is_success: string;
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
  }: AnalyzePreferenceArgs): Promise<[AnalyzePreferenceRes, Error]>;
}

@Injectable()
export class AnalyzePreferenceRepo implements AnalyzePreferenceRepoInterface {
  async getAnalyzedProducts(
    data: AnalyzePreferenceArgs,
  ): Promise<[AnalyzePreferenceRes, Error]> {
    const response = await axios.post<AnalyzePreferenceRes>(
      `https://us-central1-teatis-discovery.cloudfunctions.net/product_distribution_optimizer`,
      data,
    );

    return [response.data, null];
  }
}
