import { Test, TestingModule } from '@nestjs/testing';
import { CustomerEventLog, Prisma } from '@prisma/client';
import {  EmployeeCustomerWithAddress } from '../../domains/EmployeeCustomer';
import { MonthlyBoxSelectionProduct } from '../../domains/MonthlyBoxSelectionProduct';
import { Product } from '../../domains/Product';
import { ProductOnHand } from '../../domains/ProductOnHand';
import { ReturnValueType } from '../../filter/customError';
import { ShipheroRepositoryInterface } from '../../repositories/shiphero/shiphero.repository';
import { CustomerEventLogRepositoryInterface } from '../../repositories/teatisDB/customerEventLog/customerEventLog.repository';
import { EmployeeRepositoryInterface } from '../../repositories/teatisDB/employee/employee.repository';
import { MonthlySelectionRepositoryInterface } from '../../repositories/teatisDB/monthlySelection/monthlySelection.repository';
import { ProductGeneralRepositoryInterface } from '../../repositories/teatisDB/product/productGeneral.repository';
import { CustomerProductsAutoSwapInterface } from '../utils/customerProductsAutoSwap';
import {
  CreateEmployeeOrderUsecase,
  CreateEmployeeOrderUsecaseInterface,
} from './createEmployeeOrder.usecase';

describe('CreateEmployeeOrder', () => {
  let usecase: CreateEmployeeOrderUsecaseInterface;
  let MockedEmployeeRepository: Partial<EmployeeRepositoryInterface>;
  let MockedMonthlySelectionRepository: Partial<MonthlySelectionRepositoryInterface>;
  let MockedShipheroRepository: Partial<ShipheroRepositoryInterface>;
  let MockedCustomerProductsAutoSwap: Partial<CustomerProductsAutoSwapInterface>;
  let MockedProductGeneralRepository: Partial<ProductGeneralRepositoryInterface>;
  let MockedCustomerEventLogRepository: Partial<CustomerEventLogRepositoryInterface>;

  beforeEach(async () => {
    // mock the dependencies of the use case class
    MockedEmployeeRepository = {
      // mock the methods and return values as needed
      getActiveEmployeeCustomersForOrder: () =>
        Promise.resolve<ReturnValueType<EmployeeCustomerWithAddress[]>>([
          [
            // mock some employee customers
            {
              id: 111,
              email: 'corp1@teatismeal.com',
              uuid: '0f121f30-6170-40ee-8ed5-655687f315b0',
              firstName: 'corp1',
              lastName: 'test',
              boxSubscribed: 'active',
              coachingSubscribed: 'active',
              totalPoints: 0,
              customerType: 'standard',
              employee: {
                id: 3,
                employerId: 1,
                createdAt: new Date(),
                updatedAt: new Date(),
                customerId: 19384,
                emailEligibility: 'eligible',
                monthlyOrderInterval: 1,
                employer: {
                  note: '',
                  uuid: '123',
                  createdAt: new Date(),
                  updatedAt: new Date(),
                  id: 1,
                  name: 'Teatime',
                  label: 'Teatime',
                },
              },
              customerAddress: {
                id: 3,
                customerId: 19384,
                address1: 'test',
                address2: null,
                city: 'Teatis',
                state: 'WA',
                zip: '12345',
                country: 'US',
                createdAt: new Date(),
                updatedAt: new Date(),
              },
            },
          ],
        ]),
    };
    MockedMonthlySelectionRepository = {
      // mock the methods and return values as needed
      getMonthlySelection:
        () =>
          Promise.resolve<ReturnValueType<MonthlyBoxSelectionProduct>>([
            {
              id: 4,
              label: '2023-Feb',
              boxPlan: 'standard',
              description: '',
              note: '',
              createdAt: new Date(),
              updatedAt: new Date(),
              products: [
                {
                  id: 2876,
                  sku: 'x10457-CHP-SN20217',
                  name: 'Kibo Foods: Chickpea Chips, Himalayan Salt',
                  label: 'Kibo Foods: Chickpea Chips, Himalayan Salt',
                  expertComment: 'These chickpea chips are a delicious, savory snack that’s high in protein & contains fiber - both of which contribute to feeling full',
                  glucoseValues: [],
                  ingredientLabel: 'Chickpea Flour, Rice Flour, Protein Concentrate (Soy), Tapioca Starch, Fiber (Soy), Yellow Split Pea, Vegetable Oil (Sunflower) and Himalayan Salt',
                  images: [],
                  allergenLabel: 'Soy',
                  vendor: {
                    id: 162,
                    label: 'Glico',
                    name: 'glico',
                  },
                  nutritionFact: {
                    calorie: 150,
                    totalFat: 6,
                    saturatedFat: 3.5,
                    transFat: 0,
                    cholesterole: 0,
                    sodium: 200,
                    totalCarbohydrate: 21,
                    dietaryFiber: 2,
                    totalSugar: 1,
                    sugarAlcohol: 0,
                    addedSugar: 1,
                    protein: 3,
                  },
                },

              ],
            },
          ]),
    };
    MockedShipheroRepository = {
      // mock the methods and return values as needed
      createCustomerOrder:
        () =>
          Promise.resolve<ReturnValueType<ProductOnHand[]>>([[{ sku: '123', onHand: 1 }]]),
    };
    MockedCustomerProductsAutoSwap = {
      customerProductsAutoSwap:
        () =>
          Promise.resolve<ReturnValueType<Product[]>>([[{ id: 1, name: 'test1', label: 'Test1', sku: 'test1' }]]),
    };
    MockedProductGeneralRepository = {
      // mock the methods and return values as needed
      updateProductsStatus: () =>
        Promise.resolve<ReturnValueType<Prisma.BatchPayload>>([{ count: 2 }]),

    };
    MockedCustomerEventLogRepository = {
      // mock the methods and return values as needed
      createCustomerEventLog: () =>
        Promise.resolve<CustomerEventLog>(
          {
            id: 1,
            customerId: 2,
            eventDate: new Date(),
            type: 'boxOrdered',
          }
        ),
      getCustomerEventLog: () =>
        Promise.resolve<CustomerEventLog>(
          {
            id: 1,
            customerId: 2,
            eventDate: new Date(),
            type: 'boxSubscribed',
          }
        ),

    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateEmployeeOrderUsecase,
        {
          provide: 'EmployeeRepositoryInterface',
          useValue: MockedEmployeeRepository,
        },
        {
          provide: 'MonthlySelectionRepositoryInterface',
          useValue: MockedMonthlySelectionRepository,
        },
        {
          provide: 'ShipheroRepositoryInterface',
          useValue: MockedShipheroRepository,
        },
        {
          provide: 'CustomerProductsAutoSwapInterface',
          useValue: MockedCustomerProductsAutoSwap,
        },
        {
          provide: 'ProductGeneralRepositoryInterface',
          useValue: MockedProductGeneralRepository,
        },
        {
          provide: 'CustomerEventLogRepositoryInterface',
          useValue: MockedCustomerEventLogRepository,
        },
      ],
    }).compile();

    usecase = module.get<CreateEmployeeOrderUsecaseInterface>(
      CreateEmployeeOrderUsecase,
    );
  });

  it('create employee orders successfully', async () => {
    // call the use case method and expect a successful result
    const [res] = await usecase.createEmployeeOrder();
    expect(res).toHaveLength(1); // one employee customer
    expect(res[0].id).toBe(111); // check some properties of the employee customer
    expect(res[0].email).toBe('corp1@teatismeal.com');
  });

  it('no employee orders found', async () => {
    // mock an error from the employee repository
    MockedEmployeeRepository.getActiveEmployeeCustomersForOrder = () =>
      Promise.resolve<ReturnValueType<EmployeeCustomerWithAddress[]>>([[]]);
    // call the use case method and expect an error result
    const [res] = await usecase.createEmployeeOrder();
    expect(res).toStrictEqual([]); // no result
  });

});
