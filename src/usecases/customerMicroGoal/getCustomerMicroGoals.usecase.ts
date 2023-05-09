import { Inject, Injectable } from '@nestjs/common';

import { CustomerGeneralRepositoryInterface } from '@Repositories/teatisDB/customer/customerGeneral.repository';
import { CustomerSurveyResponseRepositoryInterface } from '../../repositories/teatisDB/customer/customerSurveyResponse.repository';
import { CustomerMicroGoalRepositoryInterface } from '../../repositories/teatisDB/customerMicroGoal/customerMicroGoal.repository';
import { ReturnValueType } from '../../filter/customError';
import { GetCustomerMicroGoalsRequestDto } from '../../controllers/customerMicroGoal/dtos/request/getCustomerMicroGoals.dto';
import { GetCustomerMicroGoalsResponseDto } from '../../controllers/customerMicroGoal/dtos/response/getCustomerMicroGoals.dto';
import { QuestionName } from '../../shared/constants/questionName';
import { SurveyQuestionResponsesWithOptions } from '../../domains/SurveyQuestionResponse';
import { CustomerMicroGoalWithActionSteps } from '../../domains/CustomerMicroGoalWithActionSteps';
import { Customer } from '../../domains/Customer';
import { ActionStep, ActionStepImage, CustomerActionStep, CustomerActionStepImage } from '@prisma/client';
import { MicroGoalCategoryTypes } from '../../shared/constants/microGoalCategories';

export interface GetCustomerMicroGoalsUsecaseInterface {
  execute({ uuid }: GetCustomerMicroGoalsRequestDto): Promise<
    ReturnValueType<GetCustomerMicroGoalsResponseDto.Main>
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

  ) {}

  private transformActionSteps(
    actionSteps: (ActionStep & { actionStepImage?: ActionStepImage[]})[],
    customerActionSteps: (CustomerActionStep & {customerActionStepImage?: CustomerActionStepImage[]})[])
    : GetCustomerMicroGoalsResponseDto.CustomerActionStep[] {
    return actionSteps.map((actionStep): GetCustomerMicroGoalsResponseDto.CustomerActionStep => {
      const customerActionStep = customerActionSteps.find((cas) => cas.actionStepId === actionStep.id);

      let mainText = '';
      let subText = '';

      if (customerActionStep) {
        mainText = customerActionStep.customizedMainText || actionStep.mainText;
        subText = customerActionStep.customizedSubText || actionStep.subText;

        actionStep.actionStepImage.forEach((actionStepImage) => {
          const casImage = customerActionStep.customerActionStepImage?.
            find((image) => image.position === actionStepImage.position);
          if (casImage) actionStepImage.src = casImage.src;
        });
      }

      return {
        id: customerActionStep.id,
        order: actionStep.order,
        mainText,
        subText,
        reason: actionStep.reason,
        completedAt: customerActionStep.completedAt,
        imageUrl: actionStep.actionStepImage.length > 0 ? actionStep.actionStepImage[0].src : undefined,
      };
    });
  }

  private transformMicroGoals(customerMicroGoalWithActionSteps: CustomerMicroGoalWithActionSteps[])
  : GetCustomerMicroGoalsResponseDto.CustomerMicroGoal[] {
    return customerMicroGoalWithActionSteps.map(({ id, label, order, category, actionSteps, customerActionSteps }) => {
      const mappedActionSteps = this.transformActionSteps(actionSteps, customerActionSteps);

      return {
        id,
        label,
        order,
        category: category.name,
        actionSteps: mappedActionSteps,
      };
    });
  }

  private transformToDto(
    customer: Customer,
    customerMicroGoalWithActionSteps: CustomerMicroGoalWithActionSteps[],
    nextDotExamMonthLeft: number)
  : GetCustomerMicroGoalsResponseDto.Main {
    const customerMicroGoals = this.transformMicroGoals(customerMicroGoalWithActionSteps);

    return {
      id: customer.id,
      uuid: customer.uuid,
      nextDotExamMonthLeft,
      firstName: customer.firstName,
      lastName: customer.lastName,
      microGoals: customerMicroGoals,
    };
  }

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
    ReturnValueType<GetCustomerMicroGoalsResponseDto.Main>> {
    const [customer, getCustomerError] = await this.customerGeneralRepository.getCustomerByUuid({ uuid });
    if(getCustomerError) return [undefined, getCustomerError];

    const [customerMicroGoals, getCustomerMicroGoalsWithActionStepsError] =
      await this.customerMicroGoalRepository.getCustomerMicroGoalsWithActionSteps(
        { customerId: customer.id },
      );

    if (getCustomerMicroGoalsWithActionStepsError)
      return [undefined, getCustomerMicroGoalsWithActionStepsError];

    const foundCategory = {
      [MicroGoalCategoryTypes.A1C]: false,
      [MicroGoalCategoryTypes.Exercise]: false,
      [MicroGoalCategoryTypes.Food]: false,
      [MicroGoalCategoryTypes.Hydration]: false,
      [MicroGoalCategoryTypes.Stress]: false,
    };
    // find uncompleted micro goals on each category
    const sortedCustomerMicroGoals = customerMicroGoals.sort((a, b) => a.order - b.order);

    const uncompletedMicroGoals = sortedCustomerMicroGoals.filter((customerMicroGoal) => {
      if (!foundCategory[customerMicroGoal.category.name]) {
        const hasUncompleted = customerMicroGoal.customerActionSteps.some(
          (customerActionStep) => !customerActionStep.completedAt,
        );

        if (hasUncompleted) {
          foundCategory[customerMicroGoal.category.name] = true;
          return true;
        }
      }
      return false;
    });

    const hasNoUncompleted = Object.keys(foundCategory).filter((key) => !foundCategory[key]);

    if (hasNoUncompleted.length) {
      hasNoUncompleted.forEach((key) => {
        const microGoalsInCategory = sortedCustomerMicroGoals.filter(
          (customerMicroGoal) => customerMicroGoal.category.name === key,
        );

        if (microGoalsInCategory.length) {
          const randomIndex = Math.floor(Math.random() * microGoalsInCategory.length);
          const randomCustomerMicroGoal = microGoalsInCategory[randomIndex];
          uncompletedMicroGoals.push(randomCustomerMicroGoal);
          foundCategory[key] = true;
        }
      });
    }

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

    const response: GetCustomerMicroGoalsResponseDto.Main =
    this.transformToDto(customer, uncompletedMicroGoals, nextDotExamMonthLeft);

    return [response];
  }
}
