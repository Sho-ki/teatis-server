import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma.service';
import { ReturnValueType } from '@Filters/customError';
import { Status } from '../../../domains/Status';
import { PrePurchaseSurveyAnswer } from '../../../domains/PrePurchaseSurveyAnswer';

interface PostTemporaryPrePurchaseSurveyArgs {
    answerIdentifier:string;
    diabetes?: string;
    medicalConditions?: { name: string, label?: string }[];
    categoryPreferences?: { name: string, label?: string }[];
    flavorDislikes?: { name: string, label?: string }[];
    ingredientDislikes?: { name: string, label?: string }[];
    allergens?: { name: string, label?: string }[];
    email: string;
    unavailableCookingMethods?: { name: string, label?: string }[];
    boxPlan?: string[];
}

interface GetTemporaryPrePurchaseSurveyArgs {
    answerIdentifier:string;
}

export interface TemporaryPrePurchaseSurveyRepositoryInterface {
  postTemporaryPrePurchaseSurvey({
    answerIdentifier,
    diabetes,
    medicalConditions,
    categoryPreferences,
    flavorDislikes,
    ingredientDislikes,
    allergens,
    email,
    unavailableCookingMethods,
    boxPlan,
  }: PostTemporaryPrePurchaseSurveyArgs):
   Promise<ReturnValueType<Status>>;

    getTemporaryPrePurchaseSurvey({ answerIdentifier }: GetTemporaryPrePurchaseSurveyArgs):
   Promise<ReturnValueType<PrePurchaseSurveyAnswer>>;
}

@Injectable()
export class TemporaryPrePurchaseSurveyRepository
implements TemporaryPrePurchaseSurveyRepositoryInterface
{
  constructor(private prisma: PrismaService) {}

  async postTemporaryPrePurchaseSurvey({
    answerIdentifier,
    diabetes,
    medicalConditions,
    categoryPreferences,
    flavorDislikes,
    ingredientDislikes,
    allergens,
    email,
    unavailableCookingMethods,
    boxPlan,
  }: PostTemporaryPrePurchaseSurveyArgs):
   Promise<ReturnValueType<Status>> {
    const response = await this.prisma.temporaryPrePurchaseAnswer.upsert({
      where: { answerIdentifier },
      create: {
        answerIdentifier,
        diabetes,
        medicalConditions,
        categoryPreferences,
        flavorDislikes,
        ingredientDislikes,
        allergens,
        email,
        unavailableCookingMethods,
        boxPlan,
      },
      update: {
        answerIdentifier,
        diabetes,
        medicalConditions,
        categoryPreferences,
        flavorDislikes,
        ingredientDislikes,
        allergens,
        email,
        unavailableCookingMethods,
        boxPlan,
      },
    });
    if(!response)return [undefined, { message: 'values are invalid', name: 'postTemporaryPrePurchaseSurvey Error' }];
    return [{ success: true }];
  }

  async getTemporaryPrePurchaseSurvey({ answerIdentifier }: GetTemporaryPrePurchaseSurveyArgs):
  Promise<ReturnValueType<PrePurchaseSurveyAnswer>> {
    const response = await this.prisma.temporaryPrePurchaseAnswer.findUnique({ where: { answerIdentifier } });

    if(!response){
      return [undefined, { message: 'answerIdentifier is invalid', name: 'answerIdentifier failed' }];
    }

    return [
      {
        answerIdentifier: response.answerIdentifier,
        email: response.email,
        diabetes: response.diabetes,
        gender: response.gender,
        medicalConditions: response.medicalConditions,
        categoryPreferences: response.categoryPreferences,
        flavorDislikes: response.flavorDislikes,
        ingredientDislikes: response.ingredientDislikes,
        allergens: response.allergens,
        unavailableCookingMethods: response.unavailableCookingMethods,
        boxPlan: response.boxPlan,
      } as PrePurchaseSurveyAnswer,
    ];
  }
}
