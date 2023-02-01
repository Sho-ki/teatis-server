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
import { postPrePurchaseSurveyUsecase2Interface } from '@Usecases/prePurchaseSurvey/postPrePurchaseSurvey2.usecase';
import { PostPrePurchaseSurvey2Dto } from '../dtos/postPrePurchaseSurvey2';

@Controller('api/discovery')
export class PrePurchaseSurveyController {
  constructor(
    @Inject('postPrePurchaseSurveyUsecase2Interface')
    private postPrePurchaseSurvey2Usecase: postPrePurchaseSurveyUsecase2Interface,
  ) {}
  // Get: api/discovery/pre-purchase
  @Get('pre-purchase')
  async getPrePurchaseSurveyQuestions(
  ) {
    return;
  }
  // Post: api/discovery/pre-purchase
  @Post('pre-purchase')
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
