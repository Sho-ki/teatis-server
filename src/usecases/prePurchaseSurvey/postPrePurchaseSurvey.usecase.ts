import { Inject, Injectable } from '@nestjs/common';

import { PostPrePurchaseSurveyDto } from '@Controllers/discoveries/dtos/postPrePurchaseSurvey';
import { ReturnValueType } from '@Filters/customError';
import { v4 as uuidv4 } from 'uuid';
import { CustomerGeneralRepositoryInterface } from '@Repositories/teatisDB/customer/customerGeneral.repository';
import { SurveyQuestionsRepositoryInterface } from '@Repositories/teatisDB/survey/surveyQuestions.repository';
import { GenderIdentify } from '@prisma/client';
import { Customer } from '@Domains/Customer';

export interface PostPrePurchaseSurveyUsecaseInterface {
  postPrePurchaseSurvey({
    gender,
    flavorDislikeIds,
    ingredientDislikeIds,
    allergenIds,
    email,
  }: PostPrePurchaseSurveyDto): Promise<
    ReturnValueType<Customer>
  >;
}

@Injectable()
export class PostPrePurchaseSurveyUsecase
implements PostPrePurchaseSurveyUsecaseInterface
{
  constructor(
    @Inject('CustomerGeneralRepositoryInterface')
    private readonly customerGeneralRepository: CustomerGeneralRepositoryInterface,
    @Inject('SurveyQuestionsRepositoryInterface')
    private readonly surveyQuestionsRepository: SurveyQuestionsRepositoryInterface,

  ) {}

  async postPrePurchaseSurvey({
    gender,
    flavorDislikeIds,
    ingredientDislikeIds,
    allergenIds,
    email,
  }: PostPrePurchaseSurveyDto): Promise<
    ReturnValueType<Customer>
  > {

    let genderLabel = 'Prefer not to say';
    if(gender){
      const [option] = await this.surveyQuestionsRepository.getOptionByOptionId({ id: gender });
      genderLabel =  option.label;
    }

    let customerGender:GenderIdentify;
    switch(genderLabel){
      case 'Female':
        customerGender = 'female';
        break;
      case 'Male':
        customerGender = 'male';
        break;
      case 'Non-Binary':
        customerGender = 'nonBinary';
        break;
      case 'Prefer not to say':
        customerGender = 'preferNotToSay';
        break;
      case 'other':
        customerGender = 'other';
        break;
    }

    const uuid = uuidv4();
    const [customer] =
      await this.customerGeneralRepository.upsertCustomer({
        uuid,
        gender: customerGender,
        flavorDislikeIds: flavorDislikeIds.filter(id => id > 0), // None = 0, others = -1,
        ingredientDislikeIds: ingredientDislikeIds.filter(id => id > 0), // None = 0, others = -1
        allergenIds: allergenIds.filter(id => id > 0), // None = 0, others = -1,
        email,
      });

    return [customer, undefined];
  }
}
