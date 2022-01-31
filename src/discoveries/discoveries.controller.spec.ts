import { Test, TestingModule } from '@nestjs/testing';
import { DiscoveriesRepo } from '../repositories/teatisDB/customerRepo/discoveriesRepo';
import { ShopifyRepo } from '../repositories/shopify/shopifyRepo';
import { TypeFormRepo } from '../repositories/typeform/typeformRepo';
import { GetRecommendProductsUseCase } from '../useCases/getRecommendProductsByReposeId';
import { DiscoveriesController } from './discoveries.controller';
import { DiscoveriesService } from './discoveries.service';
import { Discoveries, Prisma } from '@prisma/client';

let fakeGetRecommendProductsInput = {
  recommendProductData: [
    {
      title: "Teatis Meal Box - Moderate carb - Jan'22",
    },
  ],
  email: 'testuser2@testuser.com',
  BMR: 1711,
  carbsMacronutrients: 171,
  proteinMacronutrients: 150,
  fatMacronutrients: 107,
  carbsPerMeal: 43,
  proteinPerMeal: 38,
  fatPerMeal: 27,
  caloriePerMeal: 428,
};

class MockedRecommendProductsUseCase {
  // implements GetRecommendProductsUseCaseInterface
  getRecommendProducts(discoveryTypeformId: string): any {
    return fakeGetRecommendProductsInput;
  }
}

class MockedDiscoveriesRepo {
  // implements DiscoveriesRepoInterface
  async checkIfExists(typeform_id: string): Promise<boolean> {
    return true;
  }
  async createDiscovery(
    data: Prisma.DiscoveriesCreateInput,
  ): Promise<Discoveries> {
    return {
      id: 1,
      email: 'string',
      typeform_id: 'string',
      BMR: 1234,
      carbs_macronutrients: 1234,
      protein_macronutrients: 1234,
      fat_macronutrients: 1234,
      carbs_per_meal: 1234,
      protein_per_meal: 1234,
      fat_per_meal: 1234,
      calorie_per_meal: 1234,
    };
  }
}

describe('DiscoveriesController', () => {
  let controller: DiscoveriesController;
  let provider: DiscoveriesService;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DiscoveriesController],
      providers: [
        DiscoveriesService,
        TypeFormRepo,
        ShopifyRepo,
        {
          provide: GetRecommendProductsUseCase,
          useValue: MockedRecommendProductsUseCase,
        },
        { provide: DiscoveriesRepo, useValue: MockedDiscoveriesRepo },
      ],
    }).compile();

    controller = module.get<DiscoveriesController>(DiscoveriesController);
    provider = module.get<DiscoveriesService>(DiscoveriesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
