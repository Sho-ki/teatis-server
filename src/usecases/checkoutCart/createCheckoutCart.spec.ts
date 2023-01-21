import { Test, TestingModule } from '@nestjs/testing';
import { Cart } from '../../domains/Cart';
import { Customer } from '../../domains/Customer';
import { CustomerSessionInformation } from '../../domains/CustomerSessionInformation';
import { ReturnValueType } from '../../filter/customError';
import { ShopifyRepositoryInterface } from '../../repositories/shopify/shopify.repository';
import { CustomerGeneralRepositoryInterface } from '../../repositories/teatisDB/customer/customerGeneral.repository';
import { CustomerSessionRepositoryInterface } from '../../repositories/teatisDB/customer/customerSession.repository';
import { CreateCheckoutCartUsecase } from './createCheckoutCart.usecase';

describe('GetOptions', () => {
  let usecase: CreateCheckoutCartUsecase;
  let MockedShopifyRepository: Partial<ShopifyRepositoryInterface>;
  let MockedCustomerSessionRepository: Partial<CustomerSessionRepositoryInterface>;
  let MockedCustomerGeneralRepository: Partial<CustomerGeneralRepositoryInterface>;

  beforeEach(async () => {
    MockedShopifyRepository = {
      createCart: () =>
        Promise.resolve<ReturnValueType<Cart>>([{ checkoutUrl: 'teatismeal.com' }]),
    };
    MockedCustomerGeneralRepository = {
      getCustomerByUuid: ({ uuid }) =>
        (uuid === '12345'?Promise.resolve<ReturnValueType<Customer>>( [{ id: 1, email: 'teatismeal@mail.com', uuid: '12345' }]):
        Promise.resolve<ReturnValueType<Customer>>( [undefined, { name: 'Error', message: 'uuid is invalid' }])),
    };

    MockedCustomerSessionRepository={
      upsertCustomerSession: () => {
        return Promise.resolve<CustomerSessionInformation>(
          {
            id: 1,
            customerId: 2,
            sessionId: 'encrypted_session_id',
            sessionIdHash: 'hashed_session_id',
            expiredAt: null,
            activeUntil: new Date('2022-12-31'),
            createdAt: new Date('2022-01-01'),
            updatedAt: new Date('2022-07-01'),
            customer: {
              id: 2,
              uuid: 'customer_uuid',
              email: 'customer@email.com',
              phone: '555-555-5555',
              firstName: 'John',
              lastName: 'Doe',
              middleName: 'Smith',
              coachingStatus: 'active',
            },
          },
        );
      },
    };
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateCheckoutCartUsecase,
        {
          provide: 'CustomerSessionRepositoryInterface',
          useValue: MockedCustomerSessionRepository,
        },
        {
          provide: 'ShopifyRepositoryInterface',
          useValue: MockedShopifyRepository,
        },
        {
          provide: 'CustomerGeneralRepositoryInterface',
          useValue: MockedCustomerGeneralRepository,
        },
      ],
    }).compile();

    usecase = module.get<CreateCheckoutCartUsecase>(
      CreateCheckoutCartUsecase,
    );
  });

  it('success', async () => {
    const uuid = '12345';
    const practitionerBoxUuid = '98765';
    const [res, error] = await usecase.createCheckoutCart(
      { uuid, practitionerBoxUuid, deliveryInterval: 1, size: 'mini', sessionId: 'sessionId' });
    expect(res.checkoutUrl).toBe('teatismeal.com');
    expect(error).toBeUndefined();
  });

  it('throws an error if no uuid is found', async () => {
    const uuid = '123456';
    const practitionerBoxUuid = '98765';
    const [res, error] = await usecase.createCheckoutCart(
      { uuid, practitionerBoxUuid, deliveryInterval: 1, size: 'mini', sessionId: 'sessionId' });
    expect(error).toMatchObject({ name: 'Error', message: 'uuid is invalid' });
    expect(res).toBeUndefined();
  });
});
