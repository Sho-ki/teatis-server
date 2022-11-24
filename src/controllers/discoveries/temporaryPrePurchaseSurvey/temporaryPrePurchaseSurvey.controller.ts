import {
  Body,
  Controller,
  Inject,
  Post,
  Res,
} from '@nestjs/common';

import { Response } from 'express';

import { PostTemporaryPrePurchaseSurveyDto } from '../dtos/postTemporaryPrePurchaseSurvey';
import { PostTemporaryPrePurchaseSurveyUsecaseInterface } from '../../../usecases/prePurchaseSurvey/postTemporaryPrePurchaseSurvey.usecase';
import { Status } from '../../../domains/Status';

// api/discovery
@Controller('api/discovery')
export class TemporaryPrePurchaseSurveyController {
  constructor(
    @Inject('PostTemporaryPrePurchaseSurveyUsecaseInterface')
    private postTemporaryPrePurchaseSurveyUsecase: PostTemporaryPrePurchaseSurveyUsecaseInterface,

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
}
