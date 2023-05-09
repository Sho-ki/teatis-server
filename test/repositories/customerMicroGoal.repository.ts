/* eslint-disable @typescript-eslint/no-unused-vars */
import { ReturnValueType } from '../../src/filter/customError';
import { CustomerMicroGoalRepositoryInterface } from '../../src/repositories/teatisDB/customerMicroGoal/customerMicroGoal.repository';
import { CustomerMicroGoalWithActionSteps } from '../../src/domains/CustomerMicroGoalWithActionSteps';

interface MockCustomerMicroGoalRepositoryParams {
    getCustomerMicroGoalsWithActionSteps?: Partial<CustomerMicroGoalWithActionSteps[]>;
}

export const mockCustomerMicroGoalRepository = (
  params: MockCustomerMicroGoalRepositoryParams = {}
): Partial<CustomerMicroGoalRepositoryInterface> => {
  return {
    getCustomerMicroGoalsWithActionSteps: jest
      .fn<Promise<ReturnValueType<CustomerMicroGoalWithActionSteps[]>>, []>()
      .mockResolvedValue([
        [
          {
            id: 13,
            microGoalId: 41,
            order: 1,
            createdAt: new Date(),
            updatedAt: new Date(),
            customerId: 8935,
            customerActionSteps: [
              {
                id: 50,
                customerId: 8935,
                actionStepId: 160,
                customerMicroGoalId: 13,
                customizedMainText: null,
                customizedSubText: null,
                createdAt: new Date(),
                updatedAt: new Date(),
                completedAt: null,
                customerActionStepImage: [],
              },
              {
                id: 51,
                customerId: 8935,
                actionStepId: 161,
                customerMicroGoalId: 13,
                customizedMainText: null,
                customizedSubText: null,
                createdAt: new Date(),
                updatedAt: new Date(),
                completedAt: null,
                customerActionStepImage: [],
              },
              {
                id: 52,
                customerId: 8935,
                actionStepId: 162,
                customerMicroGoalId: 13,
                customizedMainText: null,
                customizedSubText: null,
                createdAt: new Date(),
                updatedAt: new Date(),
                completedAt: null,
                customerActionStepImage: [],
              },
            ],
            actionSteps: [
              {
                id: 160,
                mainText: 'Set a reminder to check blood sugar levels at consistent intervals, such as before meals.',
                subText: null,
                reason: 'Monitoring blood glucose levels regularly is important for maintaining overall health',
                order: 1,
                microGoalId: 41,
                createdAt: new Date(),
                updatedAt: new Date(),
                actionStepImage: [],
              },
              {
                id: 161,
                mainText: 'Keep a log of blood sugar readings and note any patterns or trends.',
                subText: null,
                reason: 'Identifying trends in blood glucose levels can help to adjust medications or lifestyle habits to better manage diabetes.',
                order: 2,
                microGoalId: 41,
                createdAt: new Date(),
                updatedAt: new Date(),
                actionStepImage: [],
              },
              {
                id: 162,
                mainText: 'Share blood sugar logs with coach for review and feedback.',
                subText: null,
                reason: 'Identifying areas of improvement in blood sugar management and adjusting treatment plans accordingly.',
                order: 3,
                microGoalId: 41,
                createdAt: new Date(),
                updatedAt: new Date(),
                actionStepImage: [],
              },
            ],
            label: 'Check blood sugar levels regularly for improved diabetes management.',
            category: {
              id: 20,
              name: 'a1c',
              label: 'A1c',
              createdAt: new Date(),
              updatedAt: new Date(),
            },
          },
        ],
      ]),
    setPrismaClient: jest.fn(),
    setDefaultPrismaClient: jest.fn(),
  };
};
