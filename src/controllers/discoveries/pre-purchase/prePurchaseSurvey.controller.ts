import {
  Body,
  Controller,
  Get,
  Inject,
  Post,
  // Query,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { PostPrePurchaseSurveyUsecase2Interface } from '@Usecases/prePurchaseSurvey/postPrePurchaseSurvey2.usecase';
import { PostPrePurchaseSurvey2Dto } from '../dtos/postPrePurchaseSurvey2';
import { GetPrePurchaseSurveyUsecase } from '@Usecases/prePurchaseSurvey/getPrePurchaseSurvey.usecase';
import { ActiveSurvey } from '../../../domains/Survey';
import { PostPrePurchaseSurveyUsecaseInterface } from '../../../usecases/prePurchaseSurvey/postPrePurchaseSurvey.usecase';
import { PostPrePurchaseSurveyDto } from '../dtos/postPrePurchaseSurvey';
import { CustomerBoxType } from '../../../domains/CustomerBoxType';

@Controller('api/discovery')
export class PrePurchaseSurveyController {
  constructor(
    @Inject('PostPrePurchaseSurveyUsecase2Interface')
    private postPrePurchaseSurvey2Usecase: PostPrePurchaseSurveyUsecase2Interface,
    @Inject('PostPrePurchaseSurveyUsecaseInterface')
    private postPrePurchaseSurveyUsecase: PostPrePurchaseSurveyUsecaseInterface,
    @Inject('GetPrePurchaseSurveyUsecaseInterface')
    private getPrePurchaseSurveyUsecase: GetPrePurchaseSurveyUsecase,
  ) {}
  // Get: api/discovery/pre-purchase-survey
  @Get('pre-purchase-survey')
  async getPrePurchaseSurveyQuestions(@Res() response: Response<ActiveSurvey | Error>) {
    const [usecaseResponse, error] =
      await this.getPrePurchaseSurveyUsecase.getPrePurchaseSurveyQuestions();
    if (error) {
      return response.status(500).send(error);
    }
    return response.status(200).send(usecaseResponse);
  }
  // Post: api/discovery/pre-purchase-survey/non-setting
  @Post('pre-purchase-survey/non-setting')
  async postPrePurchaseSurveyQuestions(
    @Body() body: PostPrePurchaseSurvey2Dto,
    @Res() response: Response<unknown | Error>,
  ) {
    const [usecaseResponse, error] =
      await this.postPrePurchaseSurvey2Usecase.postPrePurchaseSurvey(body);
    if (error) {
      return response.status(500).send(error);
    }
    return response.status(201).send(usecaseResponse);
  }

  // POST: api/discovery/pre-purchase-survey
  @Post('pre-purchase-survey')
  async postPrePurchaseSurvey(
    @Body() body: PostPrePurchaseSurveyDto,
    @Res() response: Response<CustomerBoxType | Error>,
  ) {
    const [usecaseResponse, error] =
      await this.postPrePurchaseSurveyUsecase.postPrePurchaseSurvey(body);
    if (error) {
      return response.status(500).send(error);
    }

    return response.status(201).send(usecaseResponse);
  }
}
