import { Test, TestingModule } from '@nestjs/testing';
import { Cart } from '../../domains/Cart';
import { Customer } from '../../domains/Customer';
import { CustomerSession } from '../../domains/CustomerSession';
import { ReturnValueType } from '../../filter/customError';
import { ShopifyRepositoryInterface } from '../../repositories/shopify/shopify.repository';
import { CustomerGeneralRepositoryInterface } from '../../repositories/teatisDB/customer/customerGeneral.repository';
import { CustomerSessionRepositoryInterface } from '../../repositories/teatisDB/customer/customerSession.repository';
import { CreateCheckoutCartOfPractitionerBoxUsecase } from './createCheckoutCartOfPractitionerBox.usecase';

describe('GetOptions', () => {
  let usecase: CreateCheckoutCartOfPractitionerBoxUsecase;
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
      upsetCustomerSession: () => {
        return Promise.resolve<ReturnValueType<CustomerSession>>([{ id: 1, email: 'teatismeal@mail.com', uuid: '12345', sessionId: '123456789', activeUntil: new Date() }]);
      },
    };
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateCheckoutCartOfPractitionerBoxUsecase,
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

    usecase = module.get<CreateCheckoutCartOfPractitionerBoxUsecase>(
      CreateCheckoutCartOfPractitionerBoxUsecase,
    );
  });

  it('success', async () => {
    const uuid = '12345';
    const practitionerBoxUuid = '98765';
    const [res, error] = await usecase.createCheckoutCartOfPractitionerBox(
      { uuid, practitionerBoxUuid, boxType: undefined, sessionId: 'sessionId' });
    expect(res.checkoutUrl).toBe('teatismeal.com');
    expect(error).toBeUndefined();
  });

  it('throws an error if no uuid is found', async () => {
    const uuid = '123456';
    const practitionerBoxUuid = '98765';
    const [res, error] = await usecase.createCheckoutCartOfPractitionerBox(
      { uuid, practitionerBoxUuid, boxType: undefined, sessionId: 'sessionId' });
    expect(error).toMatchObject({ name: 'Error', message: 'uuid is invalid' });
    expect(res).toBeUndefined();
  });
});
