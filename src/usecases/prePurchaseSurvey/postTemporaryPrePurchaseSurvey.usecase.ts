import { Inject, Injectable } from '@nestjs/common';

import { ReturnValueType } from '@Filters/customError';
import { PostTemporaryPrePurchaseSurveyDto } from '../../controllers/discoveries/dtos/postTemporaryPrePurchaseSurvey';
import { TemporaryPrePurchaseSurveyRepositoryInterface } from '../../repositories/teatisDB/temporaryPrePurchaseSurvey/temporaryPrePurchaseSurvey.repository';
import { Status } from '../../domains/Status';

export interface PostTemporaryPrePurchaseSurveyUsecaseInterface {
  postTemporaryPrePurchaseSurvey({
    answerIdentifier,
    diabetes,
    gender,
    height, // in cm
    weight, // in kg
    age,
    medicalConditions,
    activeLevel,
    A1c,
    mealsPerDay,
    categoryPreferences,
    flavorDislikes,
    ingredientDislikes,
    allergens,
    email,
    unavailableCookingMethods,
    boxPlan,
  }: PostTemporaryPrePurchaseSurveyDto): Promise<
    ReturnValueType<Status>
  >;
}

@Injectable()
export class PostTemporaryPrePurchaseSurveyUsecase
implements PostTemporaryPrePurchaseSurveyUsecaseInterface
{
  constructor(
    @Inject('TemporaryPrePurchaseSurveyRepositoryInterface')
    private readonly temporaryPrePurchaseSurveyRepository: TemporaryPrePurchaseSurveyRepositoryInterface,
  ) {}

  async postTemporaryPrePurchaseSurvey({
    answerIdentifier,
    diabetes,
    gender,
    height,
    weight,
    age,
    activeLevel,
    A1c,
    mealsPerDay,
    medicalConditions,
    categoryPreferences,
    flavorDislikes,
    ingredientDislikes,
    allergens,
    email,
    unavailableCookingMethods,
    boxPlan,
  }: PostTemporaryPrePurchaseSurveyDto): Promise<ReturnValueType<Status>> {

    const [, postTemporaryPrePurchaseSurveyError] =
    await this.temporaryPrePurchaseSurveyRepository.postTemporaryPrePurchaseSurvey(
      {
        answerIdentifier,
        diabetes,
        gender,
        height,
        weight,
        age,
        activeLevel,
        A1c,
        mealsPerDay,
        medicalConditions,
        categoryPreferences,
        flavorDislikes,
        ingredientDislikes,
        allergens,
        email,
        unavailableCookingMethods,
        boxPlan,
      }
    );
    if(postTemporaryPrePurchaseSurveyError){
      return [undefined, postTemporaryPrePurchaseSurveyError];
    }
    return [{ success: true }];
  }

}
