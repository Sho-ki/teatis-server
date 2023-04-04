import { Test, TestingModule } from '@nestjs/testing';
import { Customer } from '../../domains/Customer';
import { Url } from '../../domains/Url';
import { ReturnValueType } from '../../filter/customError';
import { CustomerGeneralRepositoryInterface } from '../../repositories/teatisDB/customer/customerGeneral.repository';
import { TerraRepositoryInterface } from '../../repositories/terra/terra.repository';
import { GetTerraAuthUrlUsecase } from './getTerraAuthUrl.usecase';

describe('GetOptions', () => {
  let usecase: GetTerraAuthUrlUsecase;
  let MockedTerraRepository: Partial<TerraRepositoryInterface>;
  let MockedCustomerGeneralRepository: Partial<CustomerGeneralRepositoryInterface>;

  beforeEach(async () => {
    MockedTerraRepository = {
      getAuthUrl: () =>
        Promise.resolve<ReturnValueType<Url>>([{ url: 'teatismeal.com' }],
        ),
    };
    MockedCustomerGeneralRepository = {
      getCustomerByUuid: ({ uuid }) =>
        (uuid === '12345'?Promise.resolve<ReturnValueType<Customer>>( [{ id: 1, email: 'teatismeal@mail.com', uuid: '12345', totalPoints: 0, firstName: 'test', lastName: 'test', boxSubscribed: 'active', coachingSubscribed: 'active', customerType: 'standard' }]):
        Promise.resolve<ReturnValueType<Customer>>( [undefined, { name: 'Error', message: 'uuid is invalid' }])),
    };
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetTerraAuthUrlUsecase,
        {
          provide: 'TerraRepositoryInterface',
          useValue: MockedTerraRepository,
        },
        {
          provide: 'CustomerGeneralRepositoryInterface',
          useValue: MockedCustomerGeneralRepository,
        },
      ],
    }).compile();

    usecase = module.get<GetTerraAuthUrlUsecase>(
      GetTerraAuthUrlUsecase,
    );
  });

  it('success', async () => {
    const uuid = '12345';
    const [res, error] = await usecase.getTerraAuthUrl(uuid);
    expect(res.url).toBe('teatismeal.com');
    expect(error).toBeUndefined();
  });

  it('throws an error if no uuid is found', async () => {
    const uuid = '123';
    const [res, error] = await usecase.getTerraAuthUrl(uuid);
    expect(error).toMatchObject({ name: 'Error', message: 'uuid is invalid' });
    expect(res).toBeUndefined();
  });
});
