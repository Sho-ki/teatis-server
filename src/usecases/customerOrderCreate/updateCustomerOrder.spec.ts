import { Test, TestingModule } from '@nestjs/testing';
import { UpdateCustomerOrderDto } from '../../controllers/discoveries/dtos/updateCustomerOrder';
import { Status } from '@Domains/Status';
import {
  GetOrderByOrderNumberRes,
  ShipheroRepoInterface,
} from '@Repositories/shiphero/shiphero.repository';
import {
  GetOrderCountRes,
  ShopifyRepoInterface,
} from '@Repositories/shopify/shopify.repository';
import {
  CustomerBoxRepoInterface,
  GetCustomerBoxProductsRes,
} from '@Repositories/teatisDB/customerRepo/customerBox.repository';
import { CustomerGeneralRepoInterface } from '@Repositories/teatisDB/customerRepo/customerGeneral.repository';
import {
  OrderQueueRepoInterface,
  UpdateOrderQueueRes,
} from '@Repositories/teatisDB/orderRepo/orderQueue.repository';
import {
  PostPrePurchaseSurveyUsecaseInterface,
  PostPrePurchaseSurveyUsecaseRes,
} from '../prePurchaseSurvey/postPrePurchaseSurvey.usecase';
import { GetNextBoxInterface, GetNextBoxRes } from '../utils/getNextBox';
import {
  UpdateCustomerOrderUsecase,
  UpdateCustomerOrderUsecaseInterface,
} from './updateCustomerOrder.usecase';

describe('GetOptions', () => {
  let usecase: UpdateCustomerOrderUsecaseInterface;
  let MockedCustomerGeneralRepo: Partial<CustomerGeneralRepoInterface>;
  let MockedOrderQueueRepo: Partial<OrderQueueRepoInterface>;
  let MockedShipheroRepo: Partial<ShipheroRepoInterface>;
  let MockedCustomerBoxRepo: Partial<CustomerBoxRepoInterface>;
  let MockedShopifyRepo: Partial<ShopifyRepoInterface>;
  let MockedNextBoxUtil: GetNextBoxInterface;
  let MockedPostPrePurchaseSurveyUsecase: Partial<PostPrePurchaseSurveyUsecaseInterface>;

  beforeEach(async () => {
    MockedCustomerGeneralRepo = {
      getCustomer: () =>
        Promise.resolve<[GetCustomerRes, Error]>([
          { id: 1, email: 'teatis@teatis.com' },
          null,
        ]),
    };
    MockedOrderQueueRepo = {
      updateOrderQueue: () =>
        Promise.resolve<[UpdateOrderQueueRes, Error]>([
          { id: 1, customerId: 1 },
          null,
        ]),
    };
    MockedShipheroRepo = {
      getOrderByOrderNumber: () =>
        Promise.resolve<[GetOrderByOrderNumberRes, Error]>([
          {
            products: [{ sku: '987654321' }],
            orderNumber: '12345',
            orderId: '123',
          },
          null,
        ]),
      updateOrder: () =>
        Promise.resolve<[CreateOrderRes, Error]>([
          {
            status: 'Success',
          },
          null,
        ]),
    };
    MockedCustomerBoxRepo = {
      getCustomerBoxProducts: () =>
        Promise.resolve<[GetCustomerBoxProductsRes, Error]>([
          { products: [{ sku: '987654321' }] },
          null,
        ]),
    };
    MockedShopifyRepo = {
      getOrderCount: () =>
        Promise.resolve<[GetOrderCountRes, Error]>([{ orderCount: 1 }, null]),
    };

    MockedNextBoxUtil = {
      getNextBoxSurvey: () =>
        Promise.resolve<[GetNextBoxRes, Error]>([
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

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UpdateCustomerOrderUsecase,
        {
          provide: 'CustomerGeneralRepoInterface',
          useValue: MockedCustomerGeneralRepo,
        },
        {
          provide: 'OrderQueueRepoInterface',
          useValue: MockedOrderQueueRepo,
        },
        {
          provide: 'ShipheroRepoInterface',
          useValue: MockedShipheroRepo,
        },
        {
          provide: 'CustomerBoxRepoInterface',
          useValue: MockedCustomerBoxRepo,
        },
        {
          provide: 'ShopifyRepoInterface',
          useValue: MockedShopifyRepo,
        },
        {
          provide: 'GetNextBoxInterface',
          useValue: MockedNextBoxUtil,
        },
        {
          provide: 'PostPrePurchaseSurveyUsecaseInterface',
          useValue: MockedPostPrePurchaseSurveyUsecase,
        },
      ],
    }).compile();

    usecase = module.get<UpdateCustomerOrderUsecase>(
      UpdateCustomerOrderUsecase,
    );
  });

  it('Order is already updated', async () => {
    MockedShipheroRepo.getOrderByOrderNumber = () =>
      Promise.resolve<[GetOrderByOrderNumberRes, Error]>([
        {
          orderNumber: '1234',
          orderId: '12345',
          products: [{ sku: '6618823458871' }, { sku: '12345' }],
        },
        null,
      ]);
    const [res, error] = await usecase.updateCustomerOrder({
      customer: { email: 'teatis@teatis.com', id: 4321 },
      line_items: [{ product_id: 1234 }],
      name: '#1111',
    });
    expect(res.status).toBe('Success');
    expect(error).toBeNull();
  });

  it('Customer has not answered the Post-Purchase survey', async () => {
    MockedCustomerBoxRepo.getCustomerBoxProducts = () =>
      Promise.resolve<[GetCustomerBoxProductsRes, Error]>([
        { products: [] },
        null,
      ]);
    const [res, error] = await usecase.updateCustomerOrder({
      customer: { email: 'teatis@teatis.com', id: 4321 },
      line_items: [{ product_id: 1234 }],
      name: '#1111',
    });
    expect(res.status).toBe('Success');
    expect(error).toBeNull();
  });
});
