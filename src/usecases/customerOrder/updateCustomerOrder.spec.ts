import { Test, TestingModule } from '@nestjs/testing';

import { ShipheroRepositoryInterface } from '@Repositories/shiphero/shiphero.repository';
import { ShopifyRepositoryInterface } from '@Repositories/shopify/shopify.repository';
import { CustomerBoxRepositoryInterface } from '@Repositories/teatisDB/customer/customerBox.repository';
import { CustomerGeneralRepositoryInterface } from '@Repositories/teatisDB/customer/customerGeneral.repository';
import { OrderQueueRepositoryInterface } from '@Repositories/teatisDB/order/orderQueue.repository';
import { PostPrePurchaseSurveyUsecaseInterface } from '../prePurchaseSurvey/postPrePurchaseSurvey.usecase';

import { Customer } from '@Domains/Customer';
import { OrderQueue } from '@Domains/OrderQueue';
import { CustomerOrder } from '@Domains/CustomerOrder';
import { Product } from '@Domains/Product';
import { CustomerOrderCount } from '@Domains/CustomerOrderCount';
import {
  UpdateCustomerOrderOfCustomerBoxUsecase,
  UpdateCustomerOrderOfCustomerBoxUsecaseInterface,
} from './updateCustomerOrderOfCustomerBox.usecase';
import {
// GetSuggestionInterface,
// GetSuggestionRes,
} from '@Usecases/utils/getSuggestion';
import { CustomerBoxType } from '../../domains/CustomerBoxType';
import { ReturnValueType } from '@Filters/customError';
import { WebhookEventRepositoryInterface } from '../../repositories/teatisDB/webhookEvent/webhookEvent.repository';
import { Status } from '../../domains/Status';

describe('GetOptions', () => {
  let usecase: UpdateCustomerOrderOfCustomerBoxUsecaseInterface;
  let MockedCustomerGeneralRepository: Partial<CustomerGeneralRepositoryInterface>;
  let MockedOrderQueueRepository: Partial<OrderQueueRepositoryInterface>;
  let MockedShipheroRepository: Partial<ShipheroRepositoryInterface>;
  let MockedCustomerBoxRepository: Partial<CustomerBoxRepositoryInterface>;
  let MockedShopifyRepository: Partial<ShopifyRepositoryInterface>;
  // let MockedNextBoxUtil: GetSuggestionInterface;
  let MockedPostPrePurchaseSurveyUsecase: Partial<PostPrePurchaseSurveyUsecaseInterface>;
  let MockedWebhookEventRepository: Partial<WebhookEventRepositoryInterface>;

  beforeEach(async () => {
    MockedCustomerGeneralRepository = {
      getCustomer: () =>
        Promise.resolve<ReturnValueType<Customer>>([{ id: 1, email: 'teatis@teatis.com', uuid: '12345657' }]),
    };
    MockedOrderQueueRepository = {
      updateOrderQueue: () =>
        Promise.resolve<ReturnValueType<OrderQueue>>([{ customerId: 1, status: 'ordered', orderNumber: '12345' }]),
    };
    MockedShipheroRepository = {
      updateOrderHoldUntilDate: () =>
        Promise.resolve<[void?, Error?]>([]),
      getCustomerOrderByOrderNumber: () =>
        Promise.resolve<ReturnValueType<CustomerOrder>>([
          {
            products: [{ sku: '987654321' }],
            orderNumber: '12345',
            orderId: '123',
          },
        ]),
      updateCustomerOrder: () =>
        Promise.resolve<ReturnValueType<CustomerOrder>>([
          {
            orderNumber: '12345',
            orderId: '123',
            products: [{ sku: '987654321' }],
          },
        ]),
    };
    MockedCustomerBoxRepository = {
      getCustomerBoxProducts: () =>
        Promise.resolve<ReturnValueType<Product[]>>([[{ sku: '987654321', id: 1, name: 'test', label: 'Test' }]]),
    };
    MockedShopifyRepository = {
      getOrderCount: () =>
        Promise.resolve<ReturnValueType<CustomerOrderCount>>([{ orderCount: 1, email: 'test@test.com' }]),
    };

    MockedWebhookEventRepository = {
      postApiId: () =>
        Promise.resolve<ReturnValueType<Status>>([{ success: true }]),
    };

    // MockedNextBoxUtil = {
    //   getSuggestion: () =>
    //     Promise.resolve<[GetSuggestionRes, Error]>([
    //       {
    //         products: [
    //           {
    //             id: 40,
    //             sku: '00000000000024',
    //             name: 'PURPO All-in-One Cereal Cup 1.73 oz',
    //             label: 'PURPO All-in-One Cereal Cup',
    //             vendor: 'Chef Soraya',
    //             images: [],
    //             expertComment: '',
    //             ingredientLabel: '',
    //             allergenLabel: '',
    //             nutritionFact: {
    //               calorie: 100,
    //               totalFat: 100,
    //               saturatedFat: 100,
    //               transFat: 100,
    //               cholesterole: 100,
    //               sodium: 100,
    //               totalCarbohydrate: 100,
    //               dietaryFiber: 100,
    //               totalSugar: 100,
    //               addedSugar: 100,
    //               sugarAlcohol: 100
    //               protein: 100,
    //             },
    //           },
    //         ],
    //       },
    //       null,
    //     ]),
    // };

    MockedPostPrePurchaseSurveyUsecase = {
      postPrePurchaseSurvey: () =>
        Promise.resolve<ReturnValueType<CustomerBoxType>>([
          {
            customerId: 1,
            customerUuid: '123',
            recommendBoxType: 'HC',
          },
          undefined,
        ]),
    };

    // MockedGetSuggestionInterface = {
    //   getSuggestion: () =>
    //     Promise.resolve<[GetSuggestionRes, Error]>([
    //       {
    //         products: [
    //           {
    //             id: 1,
    //             name: 'product1',
    //             label: '',
    //             sku: 'sku_test',
    //             expertComment: '',
    //             ingredientLabel: '',
    //             images: [],
    //             allergenLabel: '',
    //             nutritionFact: {
    //               calorie: 123,
    //               totalFat: 123,
    //               saturatedFat: 123,
    //               transFat: 123,
    //               cholesterole: 123,
    //               sodium: 123,
    //               totalCarbohydrate: 123,
    //               dietaryFiber: 123,
    //               totalSugar: 123,
    //               addedSugar: 123,
    //               sugarAlcohol: 123,
    //               protein: 123,
    //             },
    //             vendor: '',
    //           },
    //         ],
    //       },
    //       null,
    //     ]),
    // };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UpdateCustomerOrderOfCustomerBoxUsecase,
        {
          provide: 'WebhookEventRepositoryInterface',
          useValue: MockedWebhookEventRepository,
        },
        {
          provide: 'ShipheroRepositoryInterface',
          useValue: MockedShipheroRepository,
        },
        {
          provide: 'CustomerBoxRepositoryInterface',
          useValue: MockedCustomerBoxRepository,
        },
        {
          provide: 'OrderQueueRepositoryInterface',
          useValue: MockedOrderQueueRepository,
        },
        {
          provide: 'CustomerGeneralRepositoryInterface',
          useValue: MockedCustomerGeneralRepository,
        },
        {
          provide: 'ShopifyRepositoryInterface',
          useValue: MockedShopifyRepository,
        },
        {
          provide: 'GetSuggestionInterface',
          useValue: MockedPostPrePurchaseSurveyUsecase,
        },
      ],
    }).compile();

    usecase = module.get<UpdateCustomerOrderOfCustomerBoxUsecase>(
      UpdateCustomerOrderOfCustomerBoxUsecase,
    );
  });

  it('Order is already updated', async () => {
    MockedShipheroRepository.getCustomerOrderByOrderNumber = () =>
      Promise.resolve<ReturnValueType<CustomerOrder>>([
        {
          orderNumber: '1234',
          orderId: '12345',
          products: [{ sku: '6618823458871' }, { sku: '12345' }],
        },
        null,
      ]);
    const [res, error] = await usecase.updateCustomerOrderOfCustomerBox({
      name: '#1111',
      customer: { email: 'teatis@teatis.com', id: 4321 },
      line_items: [{ product_id: 1234 }],
      uuid: '1234',
      admin_graphql_api_id: '98765',
    });
    expect(res.status).toBe('ordered');
    expect(error).toBeUndefined();
  });

  it('Customer has not answered the Post-Purchase survey', async () => {
    MockedCustomerBoxRepository.getCustomerBoxProducts = () =>
      Promise.resolve<ReturnValueType<Product[]>>([[{ id: 1, name: 'test', label: 'Test', sku: '123' }], null]);
    const [res, error] = await usecase.updateCustomerOrderOfCustomerBox({
      name: '#1111',
      customer: { email: 'teatis@teatis.com', id: 4321 },
      line_items: [{ product_id: 1234 }],
      uuid: '1234',
      admin_graphql_api_id: '98765',
    });
    expect(res.status).toBe('ordered');
    expect(error).toBeUndefined();
  });
});
