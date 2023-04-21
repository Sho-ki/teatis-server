import { Inject, Injectable } from '@nestjs/common';

import { PostPrePurchaseSurveyDto } from '@Controllers/discoveries/prePurchaseSurvey/dtos/postPrePurchaseSurvey.dto';
import { ReturnValueType } from '@Filters/customError';
import { v4 as uuidv4 } from 'uuid';
import { CustomerGeneralRepositoryInterface } from '@Repositories/teatisDB/customer/customerGeneral.repository';
import { SurveyQuestionsRepositoryInterface } from '@Repositories/teatisDB/survey/surveyQuestions.repository';
import { CustomerType, EventType, GenderIdentify } from '@prisma/client';
import { Customer } from '@Domains/Customer';
import { EmployeeRepositoryInterface } from '@Repositories/teatisDB/employee/employee.repository';
import { CoachRepositoryInterface } from '../../repositories/teatisDB/coach/coach.repository';
import { CustomerEventLogRepositoryInterface } from '@Repositories/teatisDB/customerEventLog/customerEventLog.repository';

export interface PostPrePurchaseSurveyUsecaseInterface {
  postPrePurchaseSurvey({
    customerType,
    gender,
    flavorDislikeIds,
    ingredientDislikeIds,
    allergenIds,
    email,
    phone,
    firstName,
    lastName,
    address1,
    address2,
    city,
    state,
    zip,
    country,
    employerUuid,
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
    @Inject('EmployeeRepositoryInterface')
    private readonly employeeRepository: EmployeeRepositoryInterface,
    @Inject('CoachRepositoryInterface')
    private readonly coachRepository: CoachRepositoryInterface,
    @Inject('CustomerEventLogRepositoryInterface')
    private readonly customerEventLogRepository: CustomerEventLogRepositoryInterface,
  ) {}

  async postPrePurchaseSurvey({
    customerType,
    gender,
    flavorDislikeIds,
    ingredientDislikeIds,
    allergenIds,
    email,
    phone,
    firstName,
    lastName,
    address1,
    address2,
    city,
    state,
    zip,
    country,
    employerUuid,
  }: PostPrePurchaseSurveyDto): Promise<
    ReturnValueType<Customer>
  > {
    if(phone){
      const [existingCustomer] =await this.customerGeneralRepository.getCustomerByPhone({ phone });
      if(existingCustomer && existingCustomer.email !== email){
        return [undefined, { name: 'PhoneAlreadyExists', message: 'Phone already exists' }];
      }
    }

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

    const isEmployee = customerType === CustomerType.employee;
    const isDriver = customerType === CustomerType.driver;
    const uuid = uuidv4();
    const [customer] =
      await this.customerGeneralRepository.upsertCustomer({
        customerType,
        uuid,
        gender: customerGender,
        flavorDislikeIds: flavorDislikeIds.filter(id => id > 0), // None = 0, others = -1,
        ingredientDislikeIds: ingredientDislikeIds.filter(id => id > 0), // None = 0, others = -1
        allergenIds: allergenIds.filter(id => id > 0), // None = 0, others = -1,
        email,
        phone,
        firstName,
        lastName,
        coachingSubscribed: (isEmployee || isDriver) ? 'active' : undefined,
        boxSubscribed: isEmployee ? 'active' : undefined,
      });
    const customerId = customer.id;
    if(isEmployee){
      // eslint-disable-next-line no-empty-pattern
      const [[], [], [, employerNotFound]] = await Promise.all([
        this.customerGeneralRepository.upsertCustomerAddress({
          customerId: customer.id,
          address1,
          address2,
          city,
          state,
          zip,
          country,
        }),
        this.coachRepository.
          connectCustomerCoach({ coachEmail: 'coach@teatismeal.com', customerId }),
        this.employeeRepository.connectCustomerWithEmployer({ customerId, employerUuid }),

      ]);
      if(employerNotFound){
        return [undefined, employerNotFound];
      }

    }
    if(isDriver) {
      await this.coachRepository.
        connectCustomerCoach({ coachEmail: 'coach@teatismeal.com', customerId });
      await this.customerEventLogRepository.createCustomerEventLog({ customerId, event: EventType.coachingSubscribed });
    }

    return [customer, undefined];
  }
}
