import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma.service';
import { ReturnValueType } from '@Filters/customError';
import { Status } from '../../../domains/Status';
import { PrePurchaseSurveyAnswer } from '../../../domains/PrePurchaseSurveyAnswer';

interface PostTemporaryPrePurchaseSurveyArgs {
    answerIdentifier:string;
    diabetes?: string;
    gender?: string;
    height?: number;
    weight?: number;
    age?: number;
    medicalConditions?: { name: string, label?: string }[];
    activeLevel?: string;
    A1c?: string;
    mealsPerDay?: number;
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
  }: PostTemporaryPrePurchaseSurveyArgs):
   Promise<ReturnValueType<Status>> {
    const response = await this.prisma.temporaryPrePurchaseAnswer.upsert({
      where: { answerIdentifier },
      create: {
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
      },
      update: {
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
        height: Number(response.height),
        weight: Number(response.weight),
        age: Number(response.age),
        medicalConditions: response.medicalConditions,
        activeLevel: response.activeLevel,
        A1c: response.A1c,
        mealsPerDay: response.mealsPerDay,
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
