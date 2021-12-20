import { Injectable } from '@nestjs/common';

import { CreateDiscoveryInfoDto } from './dtos/create-discovery.dto';
import { GetRecommendProductsUseCase } from '../useCases/getRecommendProductsByReposeId';
import { PrismaService } from 'src/prisma.service';
import { Prisma } from '@prisma/client';

// https://teatis.notion.site/Discovery-engine-3de1c3b8bce74ec78210f6624b4eaa86
// All the calculations are conducted based on this document.
@Injectable()
export class DiscoveriesService {
  constructor(
    private prisma: PrismaService,
    private getRecommendProductsUseCase: GetRecommendProductsUseCase,
  ) {}

  async createDiscovery(body: CreateDiscoveryInfoDto) {
    const typeformId = body.typeformId;
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
    } = await this.getRecommendProductsUseCase.getRecommendProducts(typeformId);

    const isDiscoveryExist = await this.checkIfExists(typeformId);
    if (isDiscoveryExist) {
      return { recommendProductData };
    }

    const data: Prisma.DiscoveriesCreateInput = {
      typeform_id: typeformId,
      email,
      BMR,
      carbs_macronutrients: carbsMacronutrients,
      protein_macronutrients: proteinMacronutrients,
      fat_macronutrients: fatMacronutrients,
      carbs_per_meal: carbsPerMeal,
      protein_per_meal: proteinPerMeal,
      fat_per_meal: fatPerMeal,
      calorie_per_meal: caloriePerMeal,
    };

    await this.prisma.discoveries.create({ data });
    return { recommendProductData };
  }

  private async checkIfExists(typeform_id: string): Promise<boolean> {
    const findDiscoveryByTypeformId = await this.prisma.discoveries.findMany({
      where: {
        typeform_id,
      },
    });
    return findDiscoveryByTypeformId.length ? true : false;
  }
}
