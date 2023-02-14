import {
  Body,
  Controller,
  Get,
  Inject,
  Post,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { ActiveSurvey } from '@Domains/Survey';
import { GetWeeklyCheckInQuestionsUsecaseInterface } from '@Usecases/weeklyCheckIn/getWeeklyCheckInQuestions.usecase';
import { PostWeeklyCheckInDto } from '../dtos/postWeeklyCheckIn';

@Controller('api/discovery')
export class WeeklyCheckInController {
  constructor(
    @Inject('GetWeeklyCheckInQuestionsUsecaseInterface')
    private getWeeklyCheckInQuestionsUsecase: GetWeeklyCheckInQuestionsUsecaseInterface
  ) {}
  // Get: api/discovery/weekly-checkin
  @Get('weekly-checkin')
  async getPrePurchaseSurveyQuestions(@Res() response: Response<ActiveSurvey | Error>) {
    const [usecaseResponse, error] =
      await this.getWeeklyCheckInQuestionsUsecase.getWeeklyCheckInQuestions();
    if (error) {
      return response.status(500).send(error);
    }
    return response.status(200).send(usecaseResponse);
  }
  // Post: api/discovery/pre-purchase-survey/non-setting
  @Post('pre-purchase-survey/non-setting')
  async postWeeklyCheckInQuestions(
    @Body() body: PostWeeklyCheckInDto,
    @Res() response: Response<unknown | Error>,
  ) {

    return [body, response];
  }
}
