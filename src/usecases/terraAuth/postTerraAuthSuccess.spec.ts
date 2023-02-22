import { Test, TestingModule } from '@nestjs/testing';
import { PostAuthSuccessDto } from '../../controllers/terra/dtos/postAuthSuccessDto';
import { CustomerGeneralRepositoryInterface } from '../../repositories/teatisDB/customer/customerGeneral.repository';
import { TerraCustomerRepositoryInterface } from '../../repositories/teatisDB/terraCustomer/terraCustomer.repository';
import { PostTerraAuthSuccessUsecase } from './postTerraAuthSuccess.usecase';

describe('PostTerraAuthSuccessUsecase', () => {
  let usecase: PostTerraAuthSuccessUsecase;
  let terraCustomerRepository: TerraCustomerRepositoryInterface;
  let customerGeneralRepository: CustomerGeneralRepositoryInterface;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PostTerraAuthSuccessUsecase,
        {
          provide: 'TerraCustomerRepositoryInterface',
          useValue: { upsertTerraCustomer: jest.fn() },
        },
        {
          provide: 'CustomerGeneralRepositoryInterface',
          useValue: { getCustomerByUuid: jest.fn() },
        },
      ],
    }).compile();

    usecase = module.get<PostTerraAuthSuccessUsecase>(PostTerraAuthSuccessUsecase);
    terraCustomerRepository = module.get<TerraCustomerRepositoryInterface>('TerraCustomerRepositoryInterface');
    customerGeneralRepository = module.get<CustomerGeneralRepositoryInterface>('CustomerGeneralRepositoryInterface');
  });

  it('should be defined', () => {
    expect(usecase).toBeDefined();
  });

  describe('postTerraAuthSuccess', () => {
    it('should return a customer and terra customer', async () => {
      const customer = { id: 1, uuid: 'abc' };
      (customerGeneralRepository.getCustomerByUuid as jest.Mock).mockResolvedValue([customer, undefined]);
      (terraCustomerRepository.upsertTerraCustomer as jest.Mock).
        mockResolvedValue([{ terraCustomerId: 2, customerId: 1 }, undefined]);

      const dto :PostAuthSuccessDto={ terraCustomerId: '2', uuid: 'abc' };
      const result = await usecase.postTerraAuthSuccess(dto);

      expect(result).toEqual([{ terraCustomerId: 2, customerId: 1 }]);
    }); });
  it('should return an error if getting the customer by UUID fails', async () => {
    (customerGeneralRepository.getCustomerByUuid as jest.Mock).mockResolvedValue([undefined, 'error']);

    const dto :PostAuthSuccessDto={ terraCustomerId: '2', uuid: 'abc' };
    const result = await usecase.postTerraAuthSuccess(dto);

    expect(result).toEqual([undefined, 'error']);
  });

  it('should return an error if upserting the Terra customer fails', async () => {
    const customer = { id: 1, uuid: 'abc' };
    (customerGeneralRepository.getCustomerByUuid as jest.Mock).mockResolvedValue([customer, undefined]);
    (terraCustomerRepository.upsertTerraCustomer as jest.Mock).mockResolvedValue([undefined, 'error']);

    const dto :PostAuthSuccessDto={ terraCustomerId: '2', uuid: 'abc' };
    const result = await usecase.postTerraAuthSuccess(dto);

    expect(result).toEqual([undefined, 'error']);
  });
});
