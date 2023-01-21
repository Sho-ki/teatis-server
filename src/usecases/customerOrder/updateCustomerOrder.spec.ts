import { Test, TestingModule } from '@nestjs/testing';

import { ShipheroRepositoryInterface } from '@Repositories/shiphero/shiphero.repository';
import { GetShopifyOrdersByFromDateArgs, ShopifyRepositoryInterface } from '@Repositories/shopify/shopify.repository';
import { CustomerGeneralRepositoryInterface } from '@Repositories/teatisDB/customer/customerGeneral.repository';

import { Customer } from '@Domains/Customer';

import {
} from '@Usecases/utils/getSuggestion';
import { ReturnValueType } from '@Filters/customError';

import { WebhookEventRepositoryInterface } from '../../repositories/teatisDB/webhookEvent/webhookEvent.repository';
import { ProductGeneralRepositoryInterface } from '@Repositories/teatisDB/product/productGeneral.repository';
import { Status } from '../../domains/Status';
import { UpdateCustomerOrderUsecase, UpdateCustomerOrderUsecaseInterface } from './updateCustomerOrder.usecase';
import { CronMetadata, WebhookEvent } from '@prisma/client';
import { CoachRepositoryInterface } from '../../repositories/teatisDB/coach/coach.repository';
import { CustomerAuthRepositoryInterface } from '../../repositories/teatisDB/customer/customerAuth.repository';
import { CustomerEventLogRepositoryInterface } from '../../repositories/teatisDB/customerEventLog/customerEventLog.repository';
import { MonthlySelectionRepositoryInterface } from '../../repositories/teatisDB/monthlySelection/monthlySelection.repository';
import { CronMetaDataRepositoryInterface } from '../../repositories/teatisDB/webhookEvent/cronMetaData.repository';
import { TransactionOperatorInterface } from '../../repositories/utils/transactionOperator';
import { CreateCalendarEventInterface } from '../utils/createCalendarEvent';
import { CustomerProductsAutoSwapInterface } from '../utils/customerProductsAutoSwap';
import { Order } from '../../domains/Order';
import { ShopifyWebhook } from '../../domains/ShopifyWebhook';
import { Product } from '../../domains/Product';
import { CustomerPreferenceRepositoryInterface } from '../../repositories/teatisDB/customer/customerPreference.repository';

describe('GetOptions', () => {
  let usecase: UpdateCustomerOrderUsecaseInterface;
  let MockedCustomerGeneralRepository: Partial<CustomerGeneralRepositoryInterface>;
  let MockedShipheroRepository: Partial<ShipheroRepositoryInterface>;
  let MockedShopifyRepository: Partial<ShopifyRepositoryInterface>;
  let MockedProductGeneralRepository: Partial<ProductGeneralRepositoryInterface>;
  let MockedWebhookEventRepository: Partial<WebhookEventRepositoryInterface>;
  let MockedCustomerProductsAutoSwap :Partial<CustomerProductsAutoSwapInterface>;
  let MockedCustomerAuthRepository :Partial<CustomerAuthRepositoryInterface>;
  let MockedCreateCalendarEvent :Partial<CreateCalendarEventInterface>;
  let MockedCoachRepository :Partial<CoachRepositoryInterface>;
  let MockedCronMetaDataRepository :Partial<CronMetaDataRepositoryInterface>;
  let MockedTransactionOperator :Partial<TransactionOperatorInterface>;
  let MockedCustomerEventLogRepository :Partial<CustomerEventLogRepositoryInterface>;
  let MockedMonthlySelectionRepository :Partial<MonthlySelectionRepositoryInterface>;
  let MockedCustomerPreferenceRepository: Partial<CustomerPreferenceRepositoryInterface>;

  beforeEach(async () => {

    MockedCustomerProductsAutoSwap = { customerProductsAutoSwap: jest.fn<Promise<ReturnValueType<Product[]>>, []>().mockResolvedValue([[{ id: 1, sku: 'p1', name: 'test', label: 'Test' }]]) };
    MockedCustomerAuthRepository= {};
    MockedCreateCalendarEvent= {};
    MockedCoachRepository= {};
    MockedCustomerPreferenceRepository = {};
    MockedCronMetaDataRepository= {
      getLastRun: jest.fn<Promise<CronMetadata>, []>().mockResolvedValue({
        id: 1,
        name: 'updateOrder',
        lastRunAt: new Date('2022-12-20'),
        createdAt: new Date('2022-11-01'),
        updatedAt: new Date('2022-11-10'),
      }),
      updateLastRun: jest.fn<Promise<CronMetadata>, []>().mockResolvedValue({
        id: 1,
        name: 'updateOrder',
        lastRunAt: new Date('2022-12-30'),
        createdAt: new Date('2022-11-01'),
        updatedAt: new Date('2022-11-10'),
      }),
    };
    MockedTransactionOperator= {};
    MockedCustomerEventLogRepository= {};
    MockedMonthlySelectionRepository= {};
    MockedCustomerGeneralRepository = { getCustomer: jest.fn<Promise<ReturnValueType<Customer>>, []>().mockResolvedValue([{ id: 1, email: 'teatis@teatis.com', uuid: '12345657' }]) };

    MockedShipheroRepository = {
      updateOrderInformation: jest.fn<Promise<Order>, []>().mockResolvedValue({ orderNumber: '12345', orderId: '123' }),
      getCustomerOrderByOrderNumber: jest.fn().mockResolvedValue([
        {
          products: [{ sku: '987654321' }],
          orderNumber: '12345',
          orderId: '123',
        },
      ]),
      updateCustomerOrder: jest.fn().mockResolvedValue([{ sku: '123', onHand: 50 }, { sku: 'stock5', onHand: 5 }]),
    };
    MockedShopifyRepository = {
      getShopifyOrdersByFromDate:
      jest.fn<Promise<ShopifyWebhook[]>, [GetShopifyOrdersByFromDateArgs]>()
        .mockImplementation(({ fromDate }: GetShopifyOrdersByFromDateArgs) => {
          if(fromDate >= new Date('2023-01-01')){
            return Promise.resolve<ShopifyWebhook[]>([
              {
                orderNumber: 'ORD-12345',
                apiId: 'webhook1',
                attributes: [{ name: 'order_type', value: 'new' }, { name: 'payment_method', value: 'credit_card' }],
                lineItems: [{ productId: 1, sku: 'PROD-123' }, { productId: 2, sku: 'PROD-456' }],
                totalPrice: '100.00',
                shopifyCustomer: {
                  email: 'customer@example.com',
                  id: 123456,
                  phone: '555-555-5555',
                  first_name: 'John',
                  last_name: 'Doe',
                  default_address: { phone: '555-555-5555' },
                },
              },
            ]);
          }else {
            return Promise.resolve([]);
          }
        }),

    };

    MockedWebhookEventRepository = { postApiId: jest.fn<Promise<ReturnValueType<WebhookEvent>>, []>().mockResolvedValue([{  id: 1, apiId: 'webhook1', cronMetadataName: 'updateOrder', client: 'shopify', createdAt: new Date('2023-01-01'), updatedAt: new Date('2023-01-10') }])    };

    MockedProductGeneralRepository = {
      updateProductsStatus: jest.fn().mockImplementation((product) => {
        product.skus[0] === 'stock5'?
          Promise.resolve<ReturnValueType<Status>>([{ success: true }, undefined])
          : Promise.resolve<ReturnValueType<Status>>([undefined, { name: 'ERROR', message: 'invalid' }]);
      }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UpdateCustomerOrderUsecase,
        { provide: 'CustomerAuthRepositoryInterface', useValue: MockedCustomerAuthRepository },
        { provide: 'CreateCalendarEventInterface', useValue: MockedCreateCalendarEvent },
        { provide: 'CoachRepositoryInterface', useValue: MockedCoachRepository },
        { provide: 'CronMetaDataRepositoryInterface', useValue: MockedCronMetaDataRepository },
        { provide: 'TransactionOperatorInterface', useValue: MockedTransactionOperator },
        { provide: 'CustomerEventLogRepositoryInterface', useValue: MockedCustomerEventLogRepository },
        { provide: 'MonthlySelectionRepositoryInterface', useValue: MockedMonthlySelectionRepository },
        {
          provide: 'WebhookEventRepositoryInterface',
          useValue: MockedWebhookEventRepository,
        },
        {
          provide: 'ProductGeneralRepositoryInterface',
          useValue: MockedProductGeneralRepository,
        },
        {
          provide: 'ShipheroRepositoryInterface',
          useValue: MockedShipheroRepository,
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
          provide: 'CustomerProductsAutoSwapInterface',
          useValue: MockedCustomerProductsAutoSwap,
        },
        {
          provide: 'CustomerPreferenceRepositoryInterface',
          useValue: MockedCustomerPreferenceRepository,
        },
      ],
    }).compile();

    usecase = module.get<UpdateCustomerOrderUsecase>(
      UpdateCustomerOrderUsecase,
    );
  });

  // it('Orders have been already updated', async () => {
  //   MockedShipheroRepository.getCustomerOrderByOrderNumber = () =>
  //     Promise.resolve<ReturnValueType<CustomerOrder>>([
  //       {
  //         orderNumber: '1234',
  //         orderId: '12345',
  //         products: [{ sku: '6618823458871' }, { sku: '12345' }],
  //       },
  //       null,
  //     ]);
  //   const [res, error] = await usecase.updateCustomerOrder();
  //   expect(res[0].orderNumber).toBe('1234');
  //   expect(error).toBeUndefined();
  // });

  // it('should handle empty array returned from updateCustomerOrder', async () => {
  //   MockedShipheroRepository.updateCustomerOrder({ orderId: '123', orderNumber: '12345', products: [{ sku: 'product1' }], warehouseCode: 'CLB-DB' });
  //   const result = await usecase.updateCustomerOrder();
  //   expect(result).toEqual([]);
  // });

  // it('should handle empty array returned from updateCustomerOrder', async () => {
  //   MockedShipheroRepository.updateCustomerOrder({ orderId: '123', orderNumber: '12345', products: [{ sku: 'product1' }], warehouseCode: 'CLB-DB' });
  //   const result = await usecase.updateCustomerOrder();
  //   expect(result).toEqual([]);
  // });

  it('should handle empty array returned from updateCustomerOrder', async () => {
    MockedShopifyRepository.getShopifyOrdersByFromDate({ fromDate: new Date('2022-10-01') });
    const result = await usecase.updateCustomerOrder();
    expect(result).toEqual([[]]);
  });

});
