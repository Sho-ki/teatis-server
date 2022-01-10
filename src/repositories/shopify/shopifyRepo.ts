import { Injectable } from '@nestjs/common';
import axios from 'axios';
require('dotenv').config();

interface ShopifyRepoInterface {
  getMatchedProduct(carbsPerMeal: number, isHighblood: boolean): any;
}

@Injectable()
export class ShopifyRepo implements ShopifyRepoInterface {
  private getPersonTypeId(carbsPerMeal: number, isHighblood: boolean): number {
    let personTypeId: number;
    let counts = [15, 30];
    let goal = carbsPerMeal;

    let closest = counts.reduce((prev, curr) => {
      return Math.abs(curr - goal) < Math.abs(prev - goal) ? curr : prev;
    });

    if (closest === 30) {
      if (isHighblood) {
        // Moderate carb & Low sodium
        personTypeId = 6618823753783;
        // Moderate carb
      } else personTypeId = 6618823458871;
    } else {
      // Low carb
      personTypeId = 6618822967351;
    }
    return personTypeId;
  }

  async getMatchedProduct(
    carbsPerMeal: number,
    isHighblood: boolean,
  ): Promise<any> {
    try {
      const personTypeId: number = this.getPersonTypeId(
        carbsPerMeal,
        isHighblood,
      );
      const shopifyInfo = {
        API_KEY: process.env.SHOPIFY_API_KEY,
        API_PASSWORD: process.env.SHOPIFY_API_PASSWORD,
        query: 'Meal Box',
      };
      const response = await axios(
        `https://thetis-tea.myshopify.com/admin/api/2021-10/products.json?product_type=${shopifyInfo.query}`,
        {
          auth: {
            username: shopifyInfo.API_KEY,
            password: shopifyInfo.API_PASSWORD,
          },
          headers: {
            'Content-type': 'application/json',
          },
        },
      );

      const recommendProductData = response.data.products.filter(
        (product: { id: number }) => {
          return product.id === personTypeId;
        },
      );
      return recommendProductData;
    } catch (e) {
      throw new Error(e);
    }
  }
}
