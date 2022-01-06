import { CreateDiscoveryInfoDto } from './dtos/create-discovery.dto';
import { DiscoveriesRepo } from '../repositories/teatisDB/discoveriesRepo';
import { GetRecommendProductsUseCase } from '../useCases/getRecommendProductsByReposeId';
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

// https://teatis.notion.site/Discovery-engine-3de1c3b8bce74ec78210f6624b4eaa86
// All the calculations are conducted based on this document.

@Injectable()
export class DiscoveriesService {
  constructor(
    private getRecommendProductsUseCase: GetRecommendProductsUseCase,
    private discoveriesRepo: DiscoveriesRepo,
  ) {}

  async createDiscovery(body: CreateDiscoveryInfoDto) {
    const typeformId = body.typeformId;
    if (!typeformId) throw new Error('No typeformId is provided');
    const {
      recommendProductData,
      email,
      BMR,
      carbsMacronutrients,
      proteinMacronutrients,
      fatMacronutrients,
      carbsPerMeal,
      proteinPerMeal,
      fatPerMeal,
      caloriePerMeal,
    } = await this.getRecommendProductsUseCase
      .getRecommendProducts(typeformId)
      .catch(() => {
        throw new Error('No typeformId is matched');
      });

    const isDiscoveryExist = await this.discoveriesRepo
      .checkIfExists(typeformId)
      .catch(() => {
        throw new Error('Something went wrong');
      });
    if (isDiscoveryExist) {
      return { recommendProductData };
    }

    const data: Prisma.DiscoveriesCreateInput = {
      email,
      typeform_id: typeformId,
      BMR,
      carbs_macronutrients: carbsMacronutrients,
      protein_macronutrients: proteinMacronutrients,
      fat_macronutrients: fatMacronutrients,
      carbs_per_meal: carbsPerMeal,
      protein_per_meal: proteinPerMeal,
      fat_per_meal: fatPerMeal,
      calorie_per_meal: caloriePerMeal,
    };
    await this.discoveriesRepo.createDiscovery(data);

    return { recommendProductData };
  }
}
