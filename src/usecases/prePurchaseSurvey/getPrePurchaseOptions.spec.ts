import { Test, TestingModule } from '@nestjs/testing';
import {
  GetOption,
  GetOptionsArgs,
  GetOptionsRes,
  ProductGeneralRepoInterface,
} from '@Repositories/teatisDB/productRepo/productGeneral.repository';
import { GetPrePurchaseOptionsUsecase } from './getPrePurchaseOptions.usecase';

describe('GetOptions', () => {
  let usecase: GetPrePurchaseOptionsUsecase;
  let repo: ProductGeneralRepoInterface;
  let MockedProductGeneralRepo: Partial<ProductGeneralRepoInterface>;

  beforeEach(async () => {
    MockedProductGeneralRepo = {
      getOptions: ({ target }: GetOptionsArgs) =>
        Promise.resolve<[GetOptionsRes<GetOption>, Error]>([
          target === 'flavor'
            ? {
                option: [{ id: 1, name: 'mint', label: 'Mint' }],
              }
            : target === 'category'
            ? { option: [{ id: 1, name: 'chips', label: 'Chips' }] }
            : target === 'cookingMethod'
            ? { option: [{ id: 1, name: 'shake', label: 'Shake' }] }
            : target === 'ingredient'
            ? { option: [{ id: 1, name: 'nut', label: 'Nut' }] }
            : target === 'allergen'
            ? { option: [{ id: 1, name: 'fish', label: 'Fish' }] }
            : target === 'foodType'
            ? { option: [{ id: 1, name: 'organic', label: 'Organic' }] }
            : { option: [] },
          null,
        ]),
    };
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        // ProductGeneralRepo,
        GetPrePurchaseOptionsUsecase,
        {
          provide: 'ProductGeneralRepoInterface',
          useValue: MockedProductGeneralRepo,
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
    MockedProductGeneralRepo.getOptions = ({ target }: GetOptionsArgs) =>
      Promise.resolve<[GetOptionsRes<GetOption>, Error]>([
        null,
        { name: 'Not found error', message: 'Options not found' },
      ]);
    const [res, error] = await usecase.getPrePurchaseOptions();
    expect(error.name).toBe('Not found error');
    expect(res).toBe(null);
  });
});
