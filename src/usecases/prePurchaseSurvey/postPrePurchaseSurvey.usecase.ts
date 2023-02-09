import { Inject, Injectable } from '@nestjs/common';

import { PostPrePurchaseSurveyDto } from '@Controllers/discoveries/dtos/postPrePurchaseSurvey';
import { CustomerBoxType } from '../../domains/CustomerBoxType';
import { ReturnValueType } from '@Filters/customError';
import { v4 as uuidv4 } from 'uuid';
import { CustomerGeneralRepositoryInterface } from '../../repositories/teatisDB/customer/customerGeneral.repository';
import { SurveyQuestionsRepositoryInterface } from '../../repositories/teatisDB/survey/surveyQuestions.repository';
import { GenderIdentify } from '@prisma/client';

export interface PostPrePurchaseSurveyUsecaseInterface {
  postPrePurchaseSurvey({
    gender,
    flavorDislikeIds,
    ingredientDislikeIds,
    allergenIds,
    email,
  }: PostPrePurchaseSurveyDto): Promise<
    ReturnValueType<CustomerBoxType>
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
    ReturnValueType<CustomerBoxType>
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
        flavorDislikeIds,
        ingredientDislikeIds,
        allergenIds,
        email,
      });

    return [
      {
        customerId: customer.id,
        customerUuid: customer.uuid,
      },
      undefined,
    ];
  }
}
