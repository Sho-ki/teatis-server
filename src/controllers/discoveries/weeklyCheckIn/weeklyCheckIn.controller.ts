import {
  Body,
  Controller,
  Get,
  Inject,
  Post,
  Query,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { ActiveSurvey } from '@Domains/Survey';
import { GetWeeklyCheckInQuestionsUsecaseInterface } from '@Usecases/weeklyCheckIn/getWeeklyCheckInQuestions.usecase';
import { PostWeeklyCheckInDto } from './dtos/postWeeklyCheckIn';
import { PostWeeklyCheckInQuestionsUsecaseInterface } from '@Usecases/weeklyCheckIn/postWeeklyCheckInQuestions.usecase';
import { SurveyQuestionResponse } from '@prisma/client';

@Controller('api/discovery')
export class WeeklyCheckInController {
  constructor(
    @Inject('GetWeeklyCheckInQuestionsUsecaseInterface')
    private getWeeklyCheckInQuestionsUsecase: GetWeeklyCheckInQuestionsUsecaseInterface,
    @Inject('PostWeeklyCheckInQuestionsUsecaseInterface')
    private postWeeklyCheckInQuestionsUsecase: PostWeeklyCheckInQuestionsUsecaseInterface
  ) {}
  // Get: api/discovery/weekly-check-in
  @Get('weekly-check-in')
  async getWeeklyCheckInQuestions(@Query('pointToken') pointToken:string, @Res() response: Response<ActiveSurvey | Error>) {
    const [usecaseResponse, error] =
      await this.getWeeklyCheckInQuestionsUsecase.getWeeklyCheckInQuestions(pointToken);
    if (error) {
      return response.status(500).send(error);
    }
    return response.status(200).send(usecaseResponse);
  }
  // Post: api/discovery/weekly-check-in
  @Post('weekly-check-in')
  async postWeeklyCheckInQuestions(
    @Body() body: PostWeeklyCheckInDto,
    @Res() response: Response<SurveyQuestionResponse[] | Error>,
  ) {
    const [usecaseResponse, error] =
    await this.postWeeklyCheckInQuestionsUsecase.postWeeklyCheckInQuestions(body);
    if (error) {
      return response.status(500).send(error);
    }
    return response.status(201).send(usecaseResponse);
  }
}
