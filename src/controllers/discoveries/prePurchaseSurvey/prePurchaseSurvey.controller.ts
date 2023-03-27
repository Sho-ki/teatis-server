import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Post,
  Query,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { PostPrePurchaseSurveyNonSettingUsecaseInterface } from '@Usecases/prePurchaseSurvey/postPrePurchaseSurveyNonSetting.usecase';
import { PostPrePurchaseSurveyNonSettingDto } from './dtos/postPrePurchaseSurveyNonSetting.dto';
import { GetPrePurchaseSurveyUsecaseInterface } from '@Usecases/prePurchaseSurvey/getPrePurchaseSurvey.usecase';
import { ActiveSurvey } from '@Domains/Survey';
import { PostPrePurchaseSurveyUsecaseInterface } from '@Usecases/prePurchaseSurvey/postPrePurchaseSurvey.usecase';
import { PostPrePurchaseSurveyDto } from './dtos/postPrePurchaseSurvey.dto';
import { Customer } from '@Domains/Customer';
import { SurveyQuestionResponse } from '@prisma/client';
import { GetPrePurchaseSurveyDriverUsecaseInterface } from '../../../usecases/prePurchaseSurvey/getPrePurchaseSurveyDriver.usecase';
import { GetPrePurchaseSurveyEmployeeUsecaseInterface } from '../../../usecases/prePurchaseSurvey/getPrePurchaseSurveyEmployee.usecase';

@Controller('api/discovery')
export class PrePurchaseSurveyController {
  constructor(
    @Inject('PostPrePurchaseSurveyNonSettingUsecaseInterface')
    private postPrePurchaseSurveyNonSettingUsecase: PostPrePurchaseSurveyNonSettingUsecaseInterface,
    @Inject('PostPrePurchaseSurveyUsecaseInterface')
    private postPrePurchaseSurveyUsecase: PostPrePurchaseSurveyUsecaseInterface,
    @Inject('GetPrePurchaseSurveyUsecaseInterface')
    private getPrePurchaseSurveyUsecase: GetPrePurchaseSurveyUsecaseInterface,
    @Inject('GetPrePurchaseSurveyDriverUsecaseInterface')
    private getPrePurchaseSurveyDriverUsecase: GetPrePurchaseSurveyDriverUsecaseInterface,
    @Inject('GetPrePurchaseSurveyEmployeeUsecaseInterface')
    private getPrePurchaseSurveyEmployeeUsecase: GetPrePurchaseSurveyEmployeeUsecaseInterface,
  ) {}
  // Get: api/discovery/pre-purchase-survey
  @Get('pre-purchase-survey/:survey?')
  async getPrePurchaseSurveyQuestions(
    @Param('survey') survey: undefined | 'employees' | 'drivers',
    @Query('uuid') employerUuid:string,
    @Res() response: Response<ActiveSurvey | Error>) {
    let [usecaseResponse, error]: [ActiveSurvey, Error] = [undefined, undefined];
    // use different usecase for different survey
    switch (survey) {
      case 'employees':
        [usecaseResponse, error] = await
        this.getPrePurchaseSurveyEmployeeUsecase.getPrePurchaseSurveyQuestionsEmployee({ employerUuid });
        break;
      case 'drivers':
        [usecaseResponse, error] = await this.getPrePurchaseSurveyDriverUsecase.getPrePurchaseSurveyQuestionsDriver();
        break;
      default:
        [usecaseResponse, error] = await this.getPrePurchaseSurveyUsecase.getPrePurchaseSurveyQuestions();
        break;
    }

    if (error) {
      return response.status(404).send(error);
    }
    return response.status(200).send(usecaseResponse);
  }
  // Post: api/discovery/pre-purchase-survey/non-setting
  @Post('pre-purchase-survey/non-setting')
  async postPrePurchaseSurveyQuestions(
    @Body() body: PostPrePurchaseSurveyNonSettingDto,
    @Res() response: Response<SurveyQuestionResponse[] | Error>,
  ) {
    const [usecaseResponse, error] =
      await this.postPrePurchaseSurveyNonSettingUsecase.postPrePurchaseSurvey(body);
    if (error) {
      return response.status(500).send(error);
    }
    return response.status(201).send(usecaseResponse);
  }

  // POST: api/discovery/pre-purchase-survey
  @Post('pre-purchase-survey')
  async postPrePurchaseSurvey(
    @Body() body: PostPrePurchaseSurveyDto,
    @Res() response: Response<Customer | Error>,
  ) {
    const [usecaseResponse, error] =
      await this.postPrePurchaseSurveyUsecase.postPrePurchaseSurvey(body);
    if(error && error.name === 'PhoneAlreadyExists'){
      return response.status(409).send(error);
    }
    if(error && error.name === 'EmployerNotFound'){
      return response.status(404).send(error);
    }
    return response.status(201).send(usecaseResponse);
  }
}
