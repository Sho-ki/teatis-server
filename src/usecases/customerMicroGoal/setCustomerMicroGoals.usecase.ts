import { Inject, Injectable } from '@nestjs/common';

import { CustomerGeneralRepositoryInterface } from '@Repositories/teatisDB/customer/customerGeneral.repository';
import { CustomerSurveyResponseRepositoryInterface } from '../../repositories/teatisDB/customer/customerSurveyResponse.repository';
import { SurveyName } from '../../shared/constants/surveyName';
import { CustomerMicroGoalRepositoryInterface } from '../../repositories/teatisDB/customerMicroGoal/customerMicroGoal.repository';
import { ReturnValueType } from '../../filter/customError';
import { MicroGoalRepositoryInterface } from '../../repositories/teatisDB/microGoal/microGoal.respository';
import { QuestionName } from '../../shared/constants/questionName';
import { MicroGoalCategoryTypes } from '../../shared/constants/microGoalCategories';
import { MicroGoalWithActionSteps } from '../../domains/MicroGoalWithActionSteps';
import { TransactionOperatorInterface } from '../../repositories/utils/transactionOperator';
import { CustomerActionStepRepositoryInterface } from '../../repositories/teatisDB/customerActionStep/customerActionStep.repository';
import { CustomerMicroGoal } from '@prisma/client';
import { CustomerDto } from '../../controllers/ResponseDtos/Customer.dto';
import { SetCustomerMicroGoalsRequestDto } from '../../controllers/customerMicroGoal/dtos/setCustomerMicroGoals.dto';

export interface SetCustomerMicroGoalsUsecaseInterface {
  execute({ uuid }: SetCustomerMicroGoalsRequestDto): Promise<
    ReturnValueType<CustomerDto>
  >;
}

@Injectable()
export class SetCustomerMicroGoalsUsecase
implements SetCustomerMicroGoalsUsecaseInterface
{
  constructor(
    @Inject('CustomerGeneralRepositoryInterface')
    private customerGeneralRepository: CustomerGeneralRepositoryInterface,
    @Inject('CustomerSurveyResponseRepositoryInterface')
    private customerSurveyResponseRepository: CustomerSurveyResponseRepositoryInterface,
    @Inject('CustomerMicroGoalRepositoryInterface')
    private customerMicroGoalRepository: CustomerMicroGoalRepositoryInterface,
    @Inject('MicroGoalRepositoryInterface')
    private microGoalRepository: MicroGoalRepositoryInterface,
    @Inject('CustomerActionStepRepositoryInterface')
    private customerActionStepRepository: CustomerActionStepRepositoryInterface,
    @Inject('TransactionOperatorInterface')
    private transactionOperator: TransactionOperatorInterface,
  ) {}

  async execute({ uuid }: SetCustomerMicroGoalsRequestDto): Promise<
    ReturnValueType<CustomerDto>
  > {
    const [customer] = await this.customerGeneralRepository.getCustomerByUuid({ uuid });

    const [hasCustomerMicroGoals] =
      await this.customerMicroGoalRepository.getCustomerMicroGoals({ customerId: customer.id });

    if (hasCustomerMicroGoals.length > 0)
      return [undefined, { name: 'AlreadyExist', message: 'Customer micro goals already exist' }];

    // get customer pre-purchase answers by customer id
    const [customerSurveyResponses] =
      await this.customerSurveyResponseRepository.getCustomerSurveyResponses({
        customerId: customer.id,
        surveyName: SurveyName.DriverPrePurchase,
      });

    const [microGoals] =
      await this.microGoalRepository.getMicroGoalsWithActionSteps();

    const areasOfPain = [];

    customerSurveyResponses.forEach((customerSurveyResponse) => {
      if (
        customerSurveyResponse.surveyQuestion.name === QuestionName.AreaOfPain
      ) {
        const pains =
          customerSurveyResponse.surveyQuestion.surveyQuestionOptions
            .map((surveyQuestionOption) => {
              const responseIds = customerSurveyResponse.response as number[];
              if (responseIds?.includes?.(surveyQuestionOption.id)) {
                return surveyQuestionOption.label.toLowerCase();
              }
            })
            .filter(Boolean);
        areasOfPain.push(...pains);
      }
    });

    const orderedMicroGoals: MicroGoalWithActionSteps[] = microGoals.sort(
      (a, b) => {
        const aInPain = areasOfPain.includes(a.subCategory.name);
        const bInPain = areasOfPain.includes(b.subCategory.name);

        if (aInPain && !bInPain) {
          return -1;
        } else if (!aInPain && bInPain) {
          return 1;
        } else {
          return 0;
        }
      },
    );

    const currentOrderSet = {
      [MicroGoalCategoryTypes.A1C]: 0,
      [MicroGoalCategoryTypes.Exercise]: 0,
      [MicroGoalCategoryTypes.Food]: 0,
      [MicroGoalCategoryTypes.Hydration]: 0,
      [MicroGoalCategoryTypes.Stress]: 0,
    };

    const response = {
      id: customer.id,
      customerMicroGoals: orderedMicroGoals.map((microGoal) => {
        if (microGoal.category.name in currentOrderSet) {
          currentOrderSet[microGoal.category.name] += 1;
          return {
            ...microGoal,
            category: microGoal.category.name,
            order: currentOrderSet[microGoal.category.name],
          };
        }
      }),
    };

    const customerOrderedMicroGoals: {
      customerId: number;
      microGoals: { id: number, order: number, actionStepIds: number[] }[];
    } = {
      customerId: customer.id,
      microGoals: response.customerMicroGoals.map(
        ({ id, order, actionSteps }) => ({
          id,
          order,
          actionStepIds: actionSteps.map(({ id }) => id),
        }),
      ),
    };

    await this.transactionOperator
      .performAtomicOperations(
        [this.customerMicroGoalRepository, this.customerActionStepRepository],
        async (): Promise<ReturnValueType<CustomerMicroGoal[]>> => {
          const result:CustomerMicroGoal[] = [];
          for(const microGoal of customerOrderedMicroGoals.microGoals) {
            const [customerMicroGoal] = await this.customerMicroGoalRepository.createCustomerMicroGoal(
              { customerId: customer.id, microGoal }
            );

            await this.customerActionStepRepository.createCustomerActionSteps(
              {
                customerId: customer.id,
                customerMicroGoalId: customerMicroGoal.id,
                actionStepIds: microGoal.actionStepIds,
              }
            );
            result.push(customerMicroGoal);

          }

          return [result];

        });

    return [customer];
  }
}
