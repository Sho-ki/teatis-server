import { Injectable } from '@nestjs/common';

import { CreateCustomerInfoDto } from './dtos/create-customer.dto';
import { GetRecommendProductsUseCase } from '../useCases/getRecommendProductsByReposeId';
import { PrismaService } from 'src/prisma.service';
import { Prisma } from '@prisma/client';

// https://teatis.notion.site/Discovery-engine-3de1c3b8bce74ec78210f6624b4eaa86
// All the calculations are conducted based on this document.
@Injectable()
export class CustomersService {
  constructor(
    private prisma: PrismaService,
    private getRecommendProductsUseCase: GetRecommendProductsUseCase,
  ) {}

  async createCustomer(body: CreateCustomerInfoDto) {
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

    const data: Prisma.CustomersCreateInput = {
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

    await this.prisma.customers.create({ data });
    return { recommendProductData };
  }
}
