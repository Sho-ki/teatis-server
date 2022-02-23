import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Redirect,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';

import { CreateDiscoveryInfoDto } from './dtos/createDiscovery';
import { v4 as uuidv4 } from 'uuid';
import { TeatisJobs } from '../../repositories/teatisJobs/dbMigrationjob';
import { GetPostPurchaseSurveyInfoDto } from './dtos/getPostPurchaseSurvey';
import { CreateOrderTaskDto } from './dtos/createOrderTask';
import { PostPostPurchaseSurveyDto } from './dtos/postPostPurchaseSurvey';
import { GetPostPurchaseSurveyUseCase } from '../../useCases/postPurcahseSurvey/getPostPurchaseSurvey.usecase';
import { PostPostPurchaseSurveyUseCase } from '../../useCases/postPurcahseSurvey/postPostPurchaseSurvey.usecase';
import { GetRecommendProductsUseCase } from '../../useCases/prePurchaseSurvey/getRecommendProducts.usecase';

@Controller('discovery')
@UsePipes(new ValidationPipe({ transform: true }))
export class DiscoveriesController {
  constructor(
    private getRecommendProductsUseCase: GetRecommendProductsUseCase,
    private getPostPurchaseSurveyUseCase: GetPostPurchaseSurveyUseCase,
    private postPostPurchaseSurveyUseCase: PostPostPurchaseSurveyUseCase,
  ) {}

  @Get()
  async createDiscovery(@Query() body: CreateDiscoveryInfoDto) {
    const typeformId = body.typeformId;
    if (!typeformId) throw new Error('No typeformId is provided');
    const { recommendProductData, customerId } =
      await this.getRecommendProductsUseCase
        .getRecommendProducts(typeformId)
        .catch(() => {
          throw new Error('No typeformId is matched');
        });

    return { recommendProductData, customerId };
  }

  @Get('post-purchase-survey')
  async getPostPurchaseSurvey(@Body() body: GetPostPurchaseSurveyInfoDto) {
    const email = body.email;
    if (!email) throw new Error('No email is provided');

    const surveyQuestions =
      await this.getPostPurchaseSurveyUseCase.getPostPurchaseSurvey({ email });
  }

  @Post('post-purchase-survey')
  async postPostPurchaseSurvey(@Body() body: PostPostPurchaseSurveyDto) {
    const res = await this.postPostPurchaseSurveyUseCase.postPostPurchaseSurvey(
      body,
    );
  }

  @Post('order-creation-webhook')
  getWebhook(@Body() body: CreateOrderTaskDto) {
    console.log('start webhook');
    setTimeout(() => {
      console.log(body);
    }, 20000);
  }

  @Get('typeform')
  @Redirect()
  redirectToTypeform() {
    const uuid = uuidv4();
    const TYPEFORM_URL_ID = process.env.TYPEFORM_URL_ID;
    return {
      url: `https://teatis.typeform.com/to/${TYPEFORM_URL_ID}#typeformid=${uuid}`,
    };
  }

  // When you migrate the data (Discoveries -> Customer etc...)
  // @Post('job')
  // async dataMigrate() {
  //   if (process.env.engine === 'local') {
  //     await this.teatisJob.databaseMigrate();
  //   }
  //   return;
  // }
}
