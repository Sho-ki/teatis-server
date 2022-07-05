import { Test, TestingModule } from '@nestjs/testing';

import { ShipheroRepoInterface } from '@Repositories/shiphero/shiphero.repository';
import { ShopifyRepoInterface } from '@Repositories/shopify/shopify.repository';
import { CustomerBoxRepoInterface } from '@Repositories/teatisDB/customerRepo/customerBox.repository';
import { CustomerGeneralRepoInterface } from '@Repositories/teatisDB/customerRepo/customerGeneral.repository';
import { OrderQueueRepoInterface } from '@Repositories/teatisDB/orderRepo/orderQueue.repository';
import {
  PostPrePurchaseSurveyUsecaseInterface,
  PostPrePurchaseSurveyUsecaseRes,
} from '../prePurchaseSurvey/postPrePurchaseSurvey.usecase';

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
  GetSuggestionInterface,
  GetSuggestionRes,
} from '@Usecases/utils/getSuggestion';

describe('GetOptions', () => {
  let usecase: UpdateCustomerOrderOfCustomerBoxUsecaseInterface;
  let MockedCustomerGeneralRepo: Partial<CustomerGeneralRepoInterface>;
  let MockedOrderQueueRepo: Partial<OrderQueueRepoInterface>;
  let MockedShipheroRepo: Partial<ShipheroRepoInterface>;
  let MockedCustomerBoxRepo: Partial<CustomerBoxRepoInterface>;
  let MockedShopifyRepo: Partial<ShopifyRepoInterface>;
  let MockedNextBoxUtil: GetSuggestionInterface;
  let MockedPostPrePurchaseSurveyUsecase: Partial<PostPrePurchaseSurveyUsecaseInterface>;
  let MockedGetSuggestionInterface: Partial<GetSuggestionInterface>;

  beforeEach(async () => {
    MockedCustomerGeneralRepo = {
      getCustomer: () =>
        Promise.resolve<[Customer?, Error?]>([
          { id: 1, email: 'teatis@teatis.com', uuid: '12345657' },
        ]),
    };
    MockedOrderQueueRepo = {
      updateOrderQueue: () =>
        Promise.resolve<[OrderQueue?, Error?]>([
          { customerId: 1, status: 'ordered', orderNumber: '12345' },
        ]),
    };
    MockedShipheroRepo = {
      getCustomerOrderByOrderNumber: () =>
        Promise.resolve<[CustomerOrder?, Error?]>([
          {
            products: [{ sku: '987654321' }],
            orderNumber: '12345',
            orderId: '123',
          },
        ]),
      updateCustomerOrder: () =>
        Promise.resolve<[CustomerOrder?, Error?]>([
          {
            orderNumber: '12345',
            orderId: '123',
            products: [{ sku: '987654321' }],
          },
        ]),
    };
    MockedCustomerBoxRepo = {
      getCustomerBoxProducts: () =>
        Promise.resolve<[Product[]?, Error?]>([
          [{ sku: '987654321', id: 1, name: 'test', label: 'Test' }],
        ]),
    };
    MockedShopifyRepo = {
      getOrderCount: () =>
        Promise.resolve<[CustomerOrderCount?, Error?]>([
          { orderCount: 1, email: 'test@test.com' },
        ]),
    };

    MockedNextBoxUtil = {
      getSuggestion: () =>
        Promise.resolve<[GetSuggestionRes, Error]>([
          {
            products: [
              {
                id: 40,
                sku: '00000000000024',
                name: 'PURPO All-in-One Cereal Cup 1.73 oz',
                label: 'PURPO All-in-One Cereal Cup',
                vendor: 'Chef Soraya',
                images: [],
                expertComment: '',
                ingredientLabel: '',
                allergenLabel: '',
                nutritionFact: {
                  calorie: 100,
                  totalFat: 100,
                  saturatedFat: 100,
                  transFat: 100,
                  cholesterole: 100,
                  sodium: 100,
                  totalCarbohydrate: 100,
                  dietaryFiber: 100,
                  totalSugar: 100,
                  addedSugar: 100,
                  protein: 100,
                },
              },
            ],
          },
          null,
        ]),
    };

    MockedPostPrePurchaseSurveyUsecase = {
      postPrePurchaseSurvey: () =>
        Promise.resolve<[PostPrePurchaseSurveyUsecaseRes, Error]>([
          {
            customerId: 1,
            customerUuid: '123',
            recommendBoxType: 'HC',
          },
          null,
        ]),
    };

    MockedGetSuggestionInterface = {
      getSuggestion: () =>
        Promise.resolve<[GetSuggestionRes, Error]>([
          {
            products: [
              {
                id: 1,
                name: 'product1',
                label: '',
                sku: 'sku_test',
                expertComment: '',
                ingredientLabel: '',
                images: [],
                allergenLabel: '',
                nutritionFact: {
                  calorie: 123,
                  totalFat: 123,
                  saturatedFat: 123,
                  transFat: 123,
                  cholesterole: 123,
                  sodium: 123,
                  totalCarbohydrate: 123,
                  dietaryFiber: 123,
                  totalSugar: 123,
                  addedSugar: 123,
                  protein: 123,
                },
                vendor: '',
              },
            ],
          },
          null,
        ]),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UpdateCustomerOrderOfCustomerBoxUsecase,
        {
          provide: 'ShipheroRepoInterface',
          useValue: MockedShipheroRepo,
        },
        {
          provide: 'CustomerBoxRepoInterface',
          useValue: MockedCustomerBoxRepo,
        },
        {
          provide: 'OrderQueueRepoInterface',
          useValue: MockedOrderQueueRepo,
        },
        {
          provide: 'CustomerGeneralRepoInterface',
          useValue: MockedCustomerGeneralRepo,
        },
        {
          provide: 'ShopifyRepoInterface',
          useValue: MockedShopifyRepo,
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
    MockedShipheroRepo.getCustomerOrderByOrderNumber = () =>
      Promise.resolve<[CustomerOrder, Error]>([
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
    });
    expect(res.status).toBe('ordered');
    expect(error).toBeNull();
  });

  it('Customer has not answered the Post-Purchase survey', async () => {
    MockedCustomerBoxRepo.getCustomerBoxProducts = () =>
      Promise.resolve<[Product[], Error]>([
        [{ id: 1, name: 'test', label: 'Test', sku: '123' }],
        null,
      ]);
    const [res, error] = await usecase.updateCustomerOrderOfCustomerBox({
      name: '#1111',
      customer: { email: 'teatis@teatis.com', id: 4321 },
      line_items: [{ product_id: 1234 }],
      uuid: '1234',
    });
    expect(res.status).toBe('ordered');
    expect(error).toBeNull();
  });
});
