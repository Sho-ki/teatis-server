import { Test, TestingModule } from '@nestjs/testing';
import {
  GetOptionsArgs,
  ProductGeneralRepositoryInterface,
} from '@Repositories/teatisDB/product/productGeneral.repository';
import { ProductFeature } from '@Domains/Product';
import { GetPrePurchaseOptionsUsecase } from './getPrePurchaseOptions.usecase';

describe('GetOptions', () => {
  let usecase: GetPrePurchaseOptionsUsecase;
  let repo: ProductGeneralRepositoryInterface;
  let MockedProductGeneralRepository: Partial<ProductGeneralRepositoryInterface>;

  beforeEach(async () => {
    MockedProductGeneralRepository = {
      getOptions: ({ target }: GetOptionsArgs) =>
        Promise.resolve<[ProductFeature[], Error]>([
          target === 'flavor'
            ? [{ id: 1, name: 'mint', label: 'Mint' }]
            : target === 'category'
            ? [{ id: 1, name: 'chips', label: 'Chips' }]
            : target === 'cookingMethod'
            ? [{ id: 1, name: 'shake', label: 'Shake' }]
            : target === 'ingredient'
            ? [{ id: 1, name: 'nut', label: 'Nut' }]
            : target === 'allergen'
            ? [{ id: 1, name: 'fish', label: 'Fish' }]
            : target === 'foodType'
            ? [{ id: 1, name: 'organic', label: 'Organic' }]
            : [],
          null,
        ]),
    };
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        // ProductGeneralRepository,
        GetPrePurchaseOptionsUsecase,
        {
          provide: 'ProductGeneralRepositoryInterface',
          useValue: MockedProductGeneralRepository,
        },
      ],
    }).compile();

    usecase = module.get<GetPrePurchaseOptionsUsecase>(
      GetPrePurchaseOptionsUsecase,
    );
  });

  it('get all the options', async () => {
    const [res, error] = await usecase.getPrePurchaseOptions();
    expect(res.flavorDislikes[0].name).toBe('mint');
    expect(res.allergens[0].name).toBe('none');
    expect(error).toBeNull();
  });

  it('throws an error if no options are found', async () => {
    MockedProductGeneralRepository.getOptions = ({ target }: GetOptionsArgs) =>
      Promise.resolve<[ProductFeature[], Error]>([
        null,
        { name: 'Not found error', message: 'Options not found' },
      ]);
    const [res, error] = await usecase.getPrePurchaseOptions();
    expect(error.name).toBe('Not found error');
    expect(res).toBe(null);
  });
});
