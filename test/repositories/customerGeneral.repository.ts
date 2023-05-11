import { Customer } from '@Domains/Customer';
import {  CustomerType, ActiveStatus } from '@prisma/client';
import { CustomerGeneralRepositoryInterface } from '../../src/repositories/teatisDB/customer/customerGeneral.repository';
import { ReturnValueType } from '../../src/filter/customError';

interface MockRepositoryParams {
  totalPoints?: number;
  phone?: string;
  boxSubscribed?: ActiveStatus;
}

export const mockCustomerGeneralRepositoryFactory = (params: MockRepositoryParams = {}):
Partial<CustomerGeneralRepositoryInterface> => {
  const customer: Customer = {
    id: 1,
    uuid: 'some-uuid',
    email: 'test@teatis.com',
    phone: '1111111111' || params.phone,
    firstName: 'first',
    lastName: 'last',
    coachingSubscribed: ActiveStatus.active,
    customerType: CustomerType.standard,
    boxSubscribed: ActiveStatus.active,
    totalPoints: 0,
  };
  return {
    // Add mock implementations for each method
    // getCustomer: jest.fn().mockResolvedValue([new Customer()]),
    // getCustomerByPhone: jest.fn().mockResolvedValue([new Customer()]),
    // getCustomersByPhone: jest.fn().mockResolvedValue([[new Customer()]]),
    // getCustomerPreference: jest.fn().mockResolvedValue([{ id: [1, 2, 3] }]),
    // getCustomerMedicalCondition: jest.fn().mockResolvedValue([new CustomerMedicalCondition()]),
    getCustomerByUuid: jest.fn<Promise<ReturnValueType<Customer>>, []>().mockResolvedValue([customer]),
    // getCustomerByTwilioChannelSid: jest.fn().mockResolvedValue([new Customer()]),
    // getCustomersWithAddress: jest.fn().mockResolvedValue([[new CustomerWithAddress()]]),
    // updateCustomerByUuid: jest.fn().mockResolvedValue([new Customer()]),
    // updateCustomerTwilioChannelSid: jest.fn().mockResolvedValue(new Customer()),
    // deactivateCustomerSubscription: jest.fn().mockResolvedValue(new Customer()),
    // activateCustomerSubscription: jest.fn().mockResolvedValue(new Customer()),
    // upsertCustomer: jest.fn().mockResolvedValue([
    //   new Customer({
    //     uuid: 'test-uuid',
    //     gender: GenderIdentify.male,
    //     flavorDislikeIds: [1, 2],
    //     ingredientDislikeIds: [3, 4],
    //     allergenIds: [5, 6],
    //     email: 'test@example.com',
    //     phone: '1234567890',
    //     firstName: 'John',
    //     lastName: 'Doe',
    //     coachingSubscribed: ActiveStatus.ACTIVE,
    //     boxSubscribed: ActiveStatus.ACTIVE,
    //     customerType: CustomerType.REGULAR,
    //   }),
    // ]),
    // upsertCustomerAddress: jest.fn().mockResolvedValue([new CustomerWithAddress()]),
    // findCustomersWithPointsOverThreshold: jest.fn().mockResolvedValue([[new Customer()]]),
    // updateTotalPoints: jest.fn().mockResolvedValue([new Customer()]),
    // setPrismaClient: jest.fn(),
    // setDefaultPrismaClient: jest.fn(),
  };
};
