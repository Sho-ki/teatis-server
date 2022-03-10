// import { Test, TestingModule } from '@nestjs/testing';
// import { CustomerInformationRepo } from '../infrastructure/repositories/teatisDB/customerRepo/customerInformationRepo';
// import { ShopifyRepo } from '../infrastructure/repositories/shopify/shopifyRepo';
// import { TypeformRepo } from '../infrastructure/repositories/typeform/typeform.repository';
// import { GetRecommendProductsUsecase } from '../useCases/prePurchaseSurvey/getRecommendProducts.usecase';
// import { DiscoveriesController } from './discoveries.controller';
// import { DiscoveriesService } from './discoveries.service';
// import { Discoveries, Prisma } from '@prisma/client';

// let fakeGetRecommendProductsInput = {
//   recommendProductData: [
//     {
//       title: "Teatis Meal Box - Moderate carb - Jan'22",
//     },
//   ],
//   email: 'testuser2@testuser.com',
//   BMR: 1711,
//   carbsMacronutrients: 171,
//   proteinMacronutrients: 150,
//   fatMacronutrients: 107,
//   carbsPerMeal: 43,
//   proteinPerMeal: 38,
//   fatPerMeal: 27,
//   caloriePerMeal: 428,
// };

// class MockedRecommendProductsUsecase {
//   // implements GetRecommendProductsUsecaseInterface
//   getRecommendProducts(discoveryTypeformId: string): any {
//     return fakeGetRecommendProductsInput;
//   }
// }

// class MockedCustomerInformationRepo {
//   // implements CustomerInformationRepoInterface
//   async checkIfExists(typeform_id: string): Promise<boolean> {
//     return true;
//   }
//   async createDiscovery(
//     data: Prisma.DiscoveriesCreateInput,
//   ): Promise<Discoveries> {
//     return {
//       id: 1,
//       email: 'string',
//       typeform_id: 'string',
//       BMR: 1234,
//       carbs_macronutrients: 1234,
//       protein_macronutrients: 1234,
//       fat_macronutrients: 1234,
//       carbs_per_meal: 1234,
//       protein_per_meal: 1234,
//       fat_per_meal: 1234,
//       calorie_per_meal: 1234,
//     };
//   }
// }

// describe('DiscoveriesController', () => {
//   let controller: DiscoveriesController;
//   let provider: DiscoveriesService;
//   beforeEach(async () => {
//     const module: TestingModule = await Test.createTestingModule({
//       controllers: [DiscoveriesController],
//       providers: [
//         DiscoveriesService,
//         TypeformRepo,
//         ShopifyRepo,
//         {
//           provide: GetRecommendProductsUsecase,
//           useValue: MockedRecommendProductsUsecase,
//         },
//         {
//           provide: CustomerInformationRepo,
//           useValue: MockedCustomerInformationRepo,
//         },
//       ],
//     }).compile();

//     controller = module.get<DiscoveriesController>(DiscoveriesController);
//     provider = module.get<DiscoveriesService>(DiscoveriesService);
//   });

//   it('should be defined', () => {
//     expect(controller).toBeDefined();
//   });
// });
