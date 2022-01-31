// import { Test, TestingModule } from '@nestjs/testing';

// import { CreateDiscoveryInfoDto } from './dtos/create-discovery.dto';
// import { Discoveries } from '.prisma/client';
// import { DiscoveriesRepo } from '../repositories/teatisDB/customerRepo/discoveriesRepo';
// import { DiscoveriesService } from './discoveries.service';
// import { GetRecommendProductsUseCase } from '../useCases/getRecommendProductsByReposeId';
// import { ShopifyRepo } from '../repositories/shopify/shopifyRepo';
// import { TypeFormRepo } from '../repositories/typeform/typeformRepo';

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

// let mockedRecommendProductsUseCase: Partial<GetRecommendProductsUseCase>;
// let mockedDiscoveriesRepo: Partial<DiscoveriesRepo>;

// describe('DiscoveryService', () => {
//   let service: DiscoveriesService;

//   beforeEach(async () => {
//     mockedRecommendProductsUseCase = {
//       async getRecommendProducts(discoveryTypeformId: string): Promise<any> {
//         if (discoveryTypeformId !== 'testuser1') {
//           throw new Error('No typeformId is matched');
//         }
//         return fakeGetRecommendProductsInput;
//       },
//     };

//     mockedDiscoveriesRepo = {
//       async checkIfExists(): Promise<boolean> {
//         return true;
//       },
//       async createDiscovery(): Promise<Discoveries> {
//         return {
//           id: 1,
//           email: 'string',
//           typeform_id: 'string',
//           BMR: 1234,
//           carbs_macronutrients: 1234,
//           protein_macronutrients: 1234,
//           fat_macronutrients: 1234,
//           carbs_per_meal: 1234,
//           protein_per_meal: 1234,
//           fat_per_meal: 1234,
//           calorie_per_meal: 1234,
//         };
//       },
//     };
//     const module: TestingModule = await Test.createTestingModule({
//       providers: [
//         DiscoveriesService,
//         TypeFormRepo,
//         ShopifyRepo,
//         {
//           provide: GetRecommendProductsUseCase,
//           useValue: mockedRecommendProductsUseCase,
//         },
//         { provide: DiscoveriesRepo, useValue: mockedDiscoveriesRepo },
//       ],
//     }).compile();

//     service = module.get<DiscoveriesService>(DiscoveriesService);
//   });

//   it('existing user testuser1', async () => {
//     let result = {
//       recommendProductData: [
//         { title: "Teatis Meal Box - Moderate carb - Jan'22" },
//       ],
//     };
//     const getDiscovery = service.createDiscovery({
//       typeformId: 'testuser1',
//     } as CreateDiscoveryInfoDto);
//     await expect(getDiscovery).resolves.toMatchObject(result);
//   });

//   it('No typeformId is provided', async () => {
//     const body: CreateDiscoveryInfoDto = { typeformId: '' };
//     const getDiscovery = service.createDiscovery(body);
//     await expect(getDiscovery).rejects.toThrow('No typeformId is provided');
//   });

//   it('No typeformId is matched', async () => {
//     const body: CreateDiscoveryInfoDto = { typeformId: 'asdfghjkl' };
//     const getDiscovery = service.createDiscovery(body);
//     await expect(getDiscovery).rejects.toThrow('No typeformId is matched');
//   });
// });
