import { Inject, Injectable } from '@nestjs/common';

import { CustomerGeneralRepositoryInterface } from '@Repositories/teatisDB/customer/customerGeneral.repository';
import { CustomerSurveyResponseRepositoryInterface } from '../../repositories/teatisDB/customer/customerSurveyResponse.repository';
import { SurveyName } from '../../shared/constants/surveyName';
import { CustomerMicroGoalRepositoryInterface } from '../../repositories/teatisDB/customerMicroGoal/customerMicroGoal.repository';
import { ReturnValueType } from '../../filter/customError';
import { MicroGoalRepositoryInterface } from '../../repositories/teatisDB/microGoal/microGoal.respository';
import { SetCustomerMicroGoalsRequestDto } from '../../controllers/microGoal/dtos/request/setCustomerMicroGoals.dto';
import { SetCustomerMicroGoalsResponseDto } from '../../controllers/microGoal/dtos/response/setCustomerMicroGoals.dto';
import { QuestionName } from '../../shared/constants/questionName';
import { MicroGoalCategoryTypes } from '../../shared/constants/microGoalCategories';
import { MicroGoalWithCategory } from '../../domains/MicroGoalWithCategory';

export interface SetCustomerMicroGoalsUsecaseInterface {
  execute({ uuid }: SetCustomerMicroGoalsRequestDto): Promise<ReturnValueType<SetCustomerMicroGoalsResponseDto>>;
}

@Injectable()
export class SetCustomerMicroGoalsUsecase implements SetCustomerMicroGoalsUsecaseInterface {
  constructor(
    @Inject('CustomerGeneralRepositoryInterface')
    private customerGeneralRepository: CustomerGeneralRepositoryInterface,
    @Inject('CustomerSurveyResponseRepositoryInterface')
    private customerSurveyResponseRepository: CustomerSurveyResponseRepositoryInterface,
    @Inject('CustomerMicroGoalRepositoryInterface')
    private customerMicroGoalRepository: CustomerMicroGoalRepositoryInterface,
    @Inject('MicroGoalRepositoryInterface')
    private microGoalRepository: MicroGoalRepositoryInterface,
  ) {}

  async execute({ uuid }: SetCustomerMicroGoalsRequestDto): Promise<ReturnValueType<SetCustomerMicroGoalsResponseDto>> {
    // get customer by uuid
    const [customer] = await this.customerGeneralRepository.getCustomerByUuid({ uuid });

    const [hasCustomerMicroGoals] = await this.customerMicroGoalRepository.
      getCustomerMicroGoals({ customerId: customer.id });

    if(hasCustomerMicroGoals.length > 0) return [undefined, { name: 'AlreadyExist', message: 'Customer micro goals already exist' }];

    // get customer pre-purchase answers by customer id
    const [customerSurveyResponses] = await this.customerSurveyResponseRepository.
      getCustomerSurveyResponses(
        { customerId: customer.id, surveyName: SurveyName.DriverPrePurchase });

    const [microGoals] = await this.microGoalRepository.getMicroGoalsWithCategory();

    const areasOfPain = [];

    customerSurveyResponses.forEach((customerSurveyResponse) => {
      if (customerSurveyResponse.surveyQuestion.name === QuestionName.AreaOfPain) {
        const pains = customerSurveyResponse.surveyQuestion.surveyQuestionOptions
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

    const orderedMicroGoals: MicroGoalWithCategory[] = microGoals.sort((a, b) => {
      const aInPain = areasOfPain.includes(a.subCategory.name);
      const bInPain = areasOfPain.includes(b.subCategory.name);

      if (aInPain && !bInPain) {
        return -1;
      } else if (!aInPain && bInPain) {
        return 1;
      } else {
        return 0;
      }
    });

    const currentOrderSet = {
      [MicroGoalCategoryTypes.A1C]: 0,
      [MicroGoalCategoryTypes.Exercise]: 0,
      [MicroGoalCategoryTypes.Food]: 0,
      [MicroGoalCategoryTypes.Hydration]: 0,
      [MicroGoalCategoryTypes.Stress]: 0,
    };

    const response:SetCustomerMicroGoalsResponseDto = {
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

    const customerOrderedMicroGoals:{customerId:number, microGoals:{id:number, order:number}[]} = {
      customerId: customer.id,
      microGoals: response.customerMicroGoals.map(({ id, order }) => ({ id, order })),
    };

    await this.customerMicroGoalRepository.createCustomerMicroGoals(customerOrderedMicroGoals);

    return [response];

  }
}
