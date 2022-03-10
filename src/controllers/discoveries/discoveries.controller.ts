import {
  Body,
  Controller,
  Get,
  Inject,
  Post,
  Query,
  Redirect,
  Res,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';

import { CreateDiscoveryInfoDto } from './dtos/createDiscovery';
import { v4 as uuidv4 } from 'uuid';
import { GetPostPurchaseSurveyInfoDto } from './dtos/getPostPurchaseSurvey';
import { CreateOrderTaskDto } from './dtos/createOrderTask';
import { PostPostPurchaseSurveyDto } from './dtos/postPostPurchaseSurvey';
import { GetPostPurchaseSurveyUsecase } from '../../usecases/postPurcahseSurvey/getPostPurchaseSurvey.usecase';
import { PostPostPurchaseSurveyUsecase } from '../../usecases/postPurcahseSurvey/postPostPurchaseSurvey.usecase';
import { GetRecommendProductsUsecase } from '../../usecases/prePurchaseSurvey/getRecommendProducts.usecase';

import { GetRecommendProductsUsecaseRes } from '../../domains/prePurchaseSurvey/getRecommendProductsUsecaseRes';
import { UpdateCustomerBoxTaskDto } from './dtos/updateCustomerBoxTask';
import { UpdateCustomerBoxUsecase } from '../../usecases/customerBox/updateCustomerBox.usecase';
import { Response } from 'express';
import { TeatisJobs } from '../../repositories/teatisJobs/dbMigrationjob';
import {
  GetAllOptionsUsecase,
  GetAllOptionsUsecaseRes,
} from '../../usecases/prePurchaseSurvey/getAllOptions.usecase';

@Controller('discovery')
@UsePipes(new ValidationPipe({ transform: true }))
export class DiscoveriesController {
  constructor(
    private getRecommendProductsUsecase: GetRecommendProductsUsecase,
    private getPostPurchaseSurveyUsecase: GetPostPurchaseSurveyUsecase,
    private postPostPurchaseSurveyUsecase: PostPostPurchaseSurveyUsecase,
    private updateCustomerBoxUsecase: UpdateCustomerBoxUsecase,
    private getAllOptionsUsecase: GetAllOptionsUsecase, // private teatisJob: TeatisJobs,
  ) {}

  @Get()
  async createDiscovery(
    @Query() body: CreateDiscoveryInfoDto,
  ): Promise<GetRecommendProductsUsecaseRes> {
    const typeformId = body.typeformId;
    if (!typeformId) throw new Error('No typeformId is provided');
    const { recommendProductData } = await this.getRecommendProductsUsecase
      .getRecommendProducts({ typeformId })
      .catch(() => {
        throw new Error('Something went wrong');
      });

    return { recommendProductData };
  }

  @Get('all-options')
  async getAllOptions(
    @Res() response: Response,
  ): Promise<Response<[GetAllOptionsUsecaseRes, Error]>> {
    const [allOptions, getAllOptionsError] =
      await this.getAllOptionsUsecase.getAllOptions();

    if (getAllOptionsError) {
      return response.status(500).send([null, getAllOptionsError]);
    }
    return response.status(200).send([allOptions, null]);
  }

  @Get('post-purchase-survey')
  async getPostPurchaseSurvey(
    @Body() body: GetPostPurchaseSurveyInfoDto,
    @Res() response: Response,
  ) {
    const email = body.email;
    const orderNumber = body.orderNumber;
    if (!email) throw new Error('No email is provided');

    const [surveyQuestions, error] =
      await this.getPostPurchaseSurveyUsecase.getPostPurchaseSurvey({
        email,
        orderNumber,
      });

    if (error) {
      return response.status(500).send(error);
    }
    return response.status(200).send(surveyQuestions);
  }

  @Post('post-purchase-survey')
  async postPostPurchaseSurvey(
    @Body() body: PostPostPurchaseSurveyDto,
    @Res() response: Response,
  ) {
    const [res, error] =
      await this.postPostPurchaseSurveyUsecase.postPostPurchaseSurvey(body);
    if (error) {
      return response.status(500).send(error);
    }
    return response.status(200).send(res);
  }

  @Post('order-creation-webhook')
  getWebhook(@Body() body: CreateOrderTaskDto) {
    console.log('start webhook');
    setTimeout(() => {
      console.log(body);
    }, 20000);
  }

  @Post('update-customer-box-webhook')
  async createCustomerBox(
    @Body() body: UpdateCustomerBoxTaskDto,
    @Res() response: Response,
  ) {
    const orderNumber = body.name;
    const email = body.email;
    const [res, error] = await this.updateCustomerBoxUsecase.updateCustomerBox({
      orderNumber,
      email,
    });
    if (error) {
      return response.status(500).send(error);
    }
    return response.status(200).send(res);
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
  //   await this.teatisJob.databaseMigrate();

  //   return;
  // }
}
