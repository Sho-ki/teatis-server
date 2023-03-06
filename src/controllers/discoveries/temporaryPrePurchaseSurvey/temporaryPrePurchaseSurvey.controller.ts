import {
  Body,
  Controller,
  Inject,
  Post,
  Get,
  Query,
  Res,
} from '@nestjs/common';

import { Response } from 'express';

import { PostTemporaryPrePurchaseSurveyDto } from './dtos/postTemporaryPrePurchaseSurvey';
import { PostTemporaryPrePurchaseSurveyUsecaseInterface } from '@Usecases/prePurchaseSurvey/postTemporaryPrePurchaseSurvey.usecase';
import { Status } from '@Domains/Status';
import { GetTemporaryPrePurchaseSurveyDto } from './dtos/getTemporaryPrePurchaseSurvey';
import { GetTemporaryPrePurchaseSurveyUsecaseInterface } from '@Usecases/prePurchaseSurvey/getTemporaryPrePurchaseSurvey.usecase';
import { PrePurchaseSurveyAnswer } from '@Domains/PrePurchaseSurveyAnswer';

// api/discovery
@Controller('api/discovery')
export class TemporaryPrePurchaseSurveyController {
  constructor(
    @Inject('PostTemporaryPrePurchaseSurveyUsecaseInterface')
    private postTemporaryPrePurchaseSurveyUsecase: PostTemporaryPrePurchaseSurveyUsecaseInterface,
    @Inject('GetTemporaryPrePurchaseSurveyUsecaseInterface')
    private getTemporaryPrePurchaseSurveyUsecase: GetTemporaryPrePurchaseSurveyUsecaseInterface,
  ) {}

  // POST: api/discovery/temporary-pre-purchase-survey
  @Post('temporary-pre-purchase-survey')
  async postTemporaryPrePurchaseSurvey(
    @Body() body: PostTemporaryPrePurchaseSurveyDto,
    @Res() response: Response<Status | Error>,
  ) {
    const [usecaseResponse, error] =
      await this.postTemporaryPrePurchaseSurveyUsecase.postTemporaryPrePurchaseSurvey(body);
    if (error) {
      return response.status(500).send(error);
    }

    return response.status(201).send(usecaseResponse);
  }

  // GET: api/discovery/temporary-pre-purchase-survey
  @Get('temporary-pre-purchase-survey')
  async getTemporaryPrePurchaseSurvey(
    @Query() query: GetTemporaryPrePurchaseSurveyDto,
    @Res() response: Response<PrePurchaseSurveyAnswer | Error>,
  ) {
    const [usecaseResponse, error] =
      await this.getTemporaryPrePurchaseSurveyUsecase.
        getTemporaryPrePurchaseSurvey({ answerIdentifier: query.answerIdentifier });
    if (error) {
      return response.status(500).send(error);
    }

    return response.status(200).send(usecaseResponse);
  }
}
