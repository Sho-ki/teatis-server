import {
  Body,
  Controller,
  Get,
  Inject,
  Post,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
// import { ActiveSurvey } from '@Domains/Survey';
import { SurveyQuestionResponse } from '@prisma/client';

@Controller('api/discovery')
export class WeeklyCheckinController {
  constructor(
  ) {}
  // Get: api/discovery/weekly-checkin
  @Get('weekly-checkin')
  // async getPrePurchaseSurveyQuestions(@Res() response: Response<ActiveSurvey | Error>) {
  async getPrePurchaseSurveyQuestions() {
    return;
  }
  // Post: api/discovery/pre-purchase-survey/non-setting
  @Post('pre-purchase-survey/non-setting')
  // async postPrePurchaseSurveyQuestions(
  //   @Body() body: PostPrePurchaseSurveyNonSettingDto,
  //   @Res() response: Response<SurveyQuestionResponse[] | Error>,
  // ) {
  async postPrePurchaseSurveyQuestions(
  ) {
    return;
  }
}
