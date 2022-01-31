import { CreateDiscoveryInfoDto } from './dtos/create-discovery.dto';
import { DiscoveriesRepo } from '../repositories/teatisDB/customerRepo/discoveriesRepo';
import { GetRecommendProductsUseCase } from '../useCases/getRecommendProductsByReposeId';
import { Injectable } from '@nestjs/common';
import { prisma, Prisma, PrismaClient } from '@prisma/client';
const prismaData = new PrismaClient();

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
      .checkIfExists(email)
      .catch(() => {
        throw new Error('Something went wrong');
      });
    if (isDiscoveryExist) {
      return { recommendProductData };
    }

    const retrieveAllCustomerNutritionItems = await this.discoveriesRepo
      .retrieveAllCustomerNutritionItems()
      .catch(() => {
        throw new Error('Cound not retrieve CustomerNutritionItems');
      });

    await this.discoveriesRepo
      .createDiscovery({
        email,
        BMR,
        carbsMacronutrients,
        proteinMacronutrients,
        fatMacronutrients,
        carbsPerMeal,
        proteinPerMeal,
        fatPerMeal,
        caloriePerMeal,
        retrieveAllCustomerNutritionItems,
      })
      .catch(() => {
        throw new Error('Cound not create a customer');
      });

    return { recommendProductData };
  }
}
