import { CreateDiscoveryInfoDto } from './dtos/create-discovery.dto';
import { GetRecommendProductsUseCase } from '../useCases/getRecommendProductsByReposeId';
import { Injectable } from '@nestjs/common';
import { getPostPurchaseSurveyInfoDto } from './dtos/get-post-purchase-survey';
import { GetLastOrderUseCase } from '../useCases/getPostPurchaseSurvey';

// https://teatis.notion.site/Discovery-engine-3de1c3b8bce74ec78210f6624b4eaa86
// All the calculations are conducted based on this document.

@Injectable()
export class DiscoveriesService {
  constructor(
    private getRecommendProductsUseCase: GetRecommendProductsUseCase,
    private getPostPurchaseSurveyUseCase: GetLastOrderUseCase,
  ) {}

  async createDiscovery(body: CreateDiscoveryInfoDto) {
    const typeformId = body.typeformId;
    if (!typeformId) throw new Error('No typeformId is provided');

    const { recommendProductData } = await this.getRecommendProductsUseCase
      .getRecommendProducts(typeformId)
      .catch(() => {
        throw new Error('No typeformId is matched');
      });

    return { recommendProductData };
  }

  async getPostPurchaseSurvey(body: getPostPurchaseSurveyInfoDto) {
    const email = body.email;
    if (!email) throw new Error('No typeformId is provided');
    console.log(
      await this.getPostPurchaseSurveyUseCase.getPostPurchaseSurvey(email),
    );
  }
}
