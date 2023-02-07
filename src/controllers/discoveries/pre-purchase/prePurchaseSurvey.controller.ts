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

@Controller('api/discovery')
export class PrePurchaseSurveyController {
  constructor(
    @Inject('PostPrePurchaseSurveyUsecase2Interface')
    private postPrePurchaseSurvey2Usecase: PostPrePurchaseSurveyUsecase2Interface,
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
}
