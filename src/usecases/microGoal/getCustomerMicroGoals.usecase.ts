import { Inject, Injectable } from '@nestjs/common';

import { CustomerGeneralRepositoryInterface } from '@Repositories/teatisDB/customer/customerGeneral.repository';
import { CustomerSurveyResponseRepositoryInterface } from '../../repositories/teatisDB/customer/customerSurveyResponse.repository';
import { CustomerMicroGoalRepositoryInterface } from '../../repositories/teatisDB/customerMicroGoal/customerMicroGoal.repository';
import { ReturnValueType } from '../../filter/customError';
import { MicroGoalRepositoryInterface } from '../../repositories/teatisDB/microGoal/microGoal.respository';
import { GetCustomerMicroGoalsRequestDto } from '../../controllers/microGoal/dtos/request/getCustomerMicroGoals.dto';
import { GetCustomerMicroGoalsResponseDto } from '../../controllers/microGoal/dtos/response/getCustomerMicroGoals.dto';
import { QuestionName } from '../../shared/constants/questionName';
import { SurveyQuestionResponsesWithOptions } from '../../domains/SurveyQuestionResponse';

export interface GetCustomerMicroGoalsUsecaseInterface {
  execute({ uuid }: GetCustomerMicroGoalsRequestDto): Promise<
    ReturnValueType<GetCustomerMicroGoalsResponseDto>
  >;
}

@Injectable()
export class GetCustomerMicroGoalsUsecase
implements GetCustomerMicroGoalsUsecaseInterface
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
  ) {}

  private calculateMonthLeft(
    customerSurveyResponse: SurveyQuestionResponsesWithOptions,
    responseId: number,
  ) {
    const surveyQuestionOption =
      customerSurveyResponse.surveyQuestion.surveyQuestionOptions.find(
        (option) => option.id === responseId,
      );

    if (!surveyQuestionOption) {
      return null;
    }

    const dotExamNextDateWhenAnswered = surveyQuestionOption.value;
    const answeredDate = customerSurveyResponse.createdAt;
    const dotExamDate = new Date(
      answeredDate.setDate(
        answeredDate.getDate() + dotExamNextDateWhenAnswered,
      ),
    );
    const monthLeft =
      (dotExamDate.getFullYear() - new Date().getFullYear()) * 12 +
      (dotExamDate.getMonth() - new Date().getMonth());

    return monthLeft;
  }

  async execute({ uuid }: GetCustomerMicroGoalsRequestDto): Promise<
    ReturnValueType<GetCustomerMicroGoalsResponseDto>
  > {
    // get customer by uuid
    const [customer] = await this.customerGeneralRepository.getCustomerByUuid({ uuid });

    const [customerMicroGoals, getCustomerMicroGoalsWithActionStepsError] =
      await this.customerMicroGoalRepository.getCustomerMicroGoalsWithActionSteps(
        { customerId: customer.id },
      );
    console.log('customerMicroGoals: ', customerMicroGoals);

    if (getCustomerMicroGoalsWithActionStepsError)
      return [undefined, getCustomerMicroGoalsWithActionStepsError];

    // get customer pre-purchase answers by customer id
    const [customerSurveyResponse] =
      await this.customerSurveyResponseRepository.getCustomerSurveyQuestionResponse(
        { customerId: customer.id, questionName: QuestionName.DotExamNext },
      );

    const nextDotExamMonthLeft = customerSurveyResponse?.response
      ? this.calculateMonthLeft(
        customerSurveyResponse,
          customerSurveyResponse.response as number,
      )
      : null;

    // const response:GetCustomerMicroGoalsResponseDto = {
    //   ...customer,
    //   nextDotExamMonthLeft,
    //   microGoals: customerMicroGoals.map((microGoal) => {
    //     const { actionSteps, category, ...rest } = microGoal;
    //     return {
    //       ...rest,
    //       category: category.name,
    //       actionSteps: actionSteps.map((actionStep) => {
    //         const { microGoal, ...rest } = actionStep;
    //         return rest;
    //       }),
    //     };
    //   }),
    // };

    // if (microGoal.category.name in currentOrderGet) {
    //   currentOrderGet[microGoal.category.name] += 1;
    //   return {
    //     ...microGoal,
    //     category: microGoal.category.name,
    //     order: currentOrderGet[microGoal.category.name],
    //   };
    // }

    // const customerOrderedMicroGoals:{customerId:number, microGoals:{id:number, order:number}[]} = {
    //   customerId: customer.id,
    //   microGoals: response.customerMicroGoals.map(({ id, order }) => ({ id, order })),
    // };

    // await this.customerMicroGoalRepository.createCustomerMicroGoals(customerOrderedMicroGoals);

    // return [response];
  }
}
