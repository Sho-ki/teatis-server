import {
  Body,
  Controller,
  Get,
  Inject,
  Post,
  Query,
  Res,
} from '@nestjs/common';

import { GetPostPurchaseSurveyUsecaseInterface } from '@Usecases/postPurcahseSurvey/getPostPurchaseSurvey.usecase';
import { PostPostPurchaseSurveyUsecaseInterface } from '@Usecases/postPurcahseSurvey/postPostPurchaseSurvey.usecase';

import { Response } from 'express';

import { GetPostPurchaseSurveyDto } from './dtos/getPostPurchaseSurvey.dto';
import { PostPostPurchaseSurveyDto } from '../dtos/postPostPurchaseSurvey';
import { PostPurchaseSurveyWithResponse } from '../../../domains/PostPurchaseSurvey';

// api/discovery
@Controller('api/discovery')
export class PostPurchaseSurveyController {
  constructor(
    @Inject('GetPostPurchaseSurveyUsecaseInterface')
    private getPostPurchaseSurveyUsecase: GetPostPurchaseSurveyUsecaseInterface,
    @Inject('PostPostPurchaseSurveyUsecaseInterface')
    private postPostPurchaseSurveyUsecase: PostPostPurchaseSurveyUsecaseInterface,
  ) {}

  // GET: api/discovery/post-purchase-survey
  @Get('post-purchase-survey')
  async getPostPurchaseSurvey(
    @Query() body: GetPostPurchaseSurveyDto,
    @Res() response: Response<PostPurchaseSurveyWithResponse | Error>,
  ) {
    const uuid = body.uuid;

    const [usecaseResponse, error] =
      await this.getPostPurchaseSurveyUsecase.getPostPurchaseSurvey({ uuid });

    if (error) {
      return response.status(500).send(error);
    }
    return response.status(200).send(usecaseResponse);
  }

  // POST: api/discovery/post-purchase-survey
  @Post('post-purchase-survey')
  async postPostPurchaseSurvey(
    @Body() body: PostPostPurchaseSurveyDto,
    @Res() response: Response<any | Error>,
  ) {
    const [usecaseResponse, error] =
      await this.postPostPurchaseSurveyUsecase.postPostPurchaseSurvey(body);
    if (error) {
      return response.status(500).send(error);
    }
    return response.status(201).send(usecaseResponse);
  }

}
