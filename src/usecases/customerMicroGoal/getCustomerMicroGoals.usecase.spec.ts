import { Test } from '@nestjs/testing';
import { GetCustomerMicroGoalsUsecase } from './getCustomerMicroGoals.usecase';
import {  mockCustomerGeneralRepositoryFactory } from '../../../test/repositories/customerGeneral.repository';
import { mockCustomerSurveyResponseRepository } from '../../../test/repositories/customerSurveyResponse.repository';
import { mockCustomerMicroGoalRepository } from '../../../test/repositories/customerMicroGoal.repository';

describe('GetCustomerMicroGoalsUsecase', () => {
  let getCustomerMicroGoalsUsecase: GetCustomerMicroGoalsUsecase;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        GetCustomerMicroGoalsUsecase,
        {
          provide: 'CustomerGeneralRepositoryInterface',
          useFactory: mockCustomerGeneralRepositoryFactory,
        },
        {
          provide: 'CustomerSurveyResponseRepositoryInterface',
          useFactory: mockCustomerSurveyResponseRepository,
        },
        {
          provide: 'CustomerMicroGoalRepositoryInterface',
          useFactory: mockCustomerMicroGoalRepository,
        },

      ],
    }).compile();

    getCustomerMicroGoalsUsecase = moduleRef.get<GetCustomerMicroGoalsUsecase>(GetCustomerMicroGoalsUsecase);
  });

  it('should be defined', () => {
    expect(getCustomerMicroGoalsUsecase).toBeDefined();
  });

  it('should return the correct response', async () => {
    const input = { uuid: 'some-uuid' };
    const [response, error] = await getCustomerMicroGoalsUsecase.execute(input);

    expect(error).toBeUndefined();

    expect(response).toBeDefined();
    expect(response.uuid).toEqual(input.uuid);
    expect(response.microGoals).toBeDefined();
  });

  it('no goals are set', async () => {
    const input = { uuid: 'some-uuid' };
    const customerMicroGoalRepository = getCustomerMicroGoalsUsecase['customerMicroGoalRepository'];
    jest.spyOn(customerMicroGoalRepository, 'getCustomerMicroGoalsWithActionSteps').mockResolvedValue([undefined, { name: 'SomeError', message: 'Some error occurred' }]);

    const [response, error] = await getCustomerMicroGoalsUsecase.execute(input);

    expect(error).toBeDefined();

    expect(response).toBeUndefined();
  });
});
