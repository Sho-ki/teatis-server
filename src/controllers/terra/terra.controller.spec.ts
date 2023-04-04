import { Test, TestingModule } from '@nestjs/testing';
import { CustomerAndTerraCustomer } from '../../domains/CustomerAndTerraCustomer';
import { Status } from '../../domains/Status';
import { Url } from '../../domains/Url';
import { ReturnValueType } from '../../filter/customError';
import { GetTerraAuthUrlUsecaseInterface } from '../../usecases/terraAuth/getTerraAuthUrl.usecase';
import { PostTerraAuthSuccessUsecaseInterface } from '../../usecases/terraAuth/postTerraAuthSuccess.usecase';
import { UpsertAllCustomersGlucoseUsecaseInterface } from '../../usecases/terraCustomerGlucose/upsertAllCustomersGlucose.usecase';
import { TerraController } from './terra.controller';

describe('TerraController', () => {
  let controller: TerraController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TerraController],
      providers: [
        {
          provide: 'GetTerraAuthUrlUsecaseInterface',
          useValue: {
            getTerraAuthUrl: () =>
              Promise.resolve<ReturnValueType<Url>>([{ url: 'teatismeal.com' }]),
          } as GetTerraAuthUrlUsecaseInterface,
        },
        {
          provide: 'PostTerraAuthSuccessUsecaseInterface',
          useValue: {
            postTerraAuthSuccess: () =>
              Promise.resolve<ReturnValueType<CustomerAndTerraCustomer>>([
                {
                  terraCustomerId: 'test', id: 1, email: 'teatismeal@mail.com',
                  uuid: 'testuuid', totalPoints: 0, firstName: 'test', lastName: 'test',
                  boxSubscribed: 'active', coachingSubscribed: 'active', customerType: 'standard',
                },
              ]),
          } as PostTerraAuthSuccessUsecaseInterface,
        },
        {
          provide: 'UpsertAllCustomersGlucoseUsecaseInterface',
          useValue: {
            upsertAllCustomersGlucose: () =>
              Promise.resolve<ReturnValueType<Status>>([{ success: true }]),
          } as UpsertAllCustomersGlucoseUsecaseInterface,
        },
      ],
    }).compile();

    controller = module.get<TerraController>(TerraController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
