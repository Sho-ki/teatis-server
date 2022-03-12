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
import { GetPostPurchaseSurveyUsecaseInterface } from '@Usecases/postPurcahseSurvey/getPostPurchaseSurvey.usecase';
import { PostPostPurchaseSurveyUsecaseInterface } from '@Usecases/postPurcahseSurvey/postPostPurchaseSurvey.usecase';
import { GetRecommendProductsUsecaseInterface } from '@Usecases/prePurchaseSurvey/getRecommendProducts.usecase';

import { GetRecommendProductsUsecaseRes } from 'src/domains/prePurchaseSurvey/getRecommendProductsUsecaseRes';
import { UpdateCustomerBoxTaskDto } from './dtos/updateCustomerBoxTask';
import { Response } from 'express';
import { TeatisJobs } from 'src/repositories/teatisJobs/dbMigrationjob';
import {
  getPrePurchaseOptionsUsecase,
  getPrePurchaseOptionsUsecaseInterface,
  GetPrePurchaseOptionsUsecaseRes,
} from '@Usecases/prePurchaseSurvey/getPrePurchaseOptions.usecase';
import { UpdateCustomerBoxUsecaseInterface } from '@Usecases/customerBox/updateCustomerBox.usecase';
import { PostPrePurchaseSurveyDto } from './dtos/postPrePurchaseSurvey';
import {
  PostPrePurchaseSurveyUsecaseInterface,
  PostPrePurchaseSurveyUsecaseRes,
} from '../../usecases/prePurchaseSurvey/postPrePurchaseSurvey.usecase';

// /discovery
@Controller('api/discovery')
@UsePipes(new ValidationPipe({ transform: true }))
export class DiscoveriesController {
  constructor(
    @Inject('GetRecommendProductsUsecaseInterface')
    private getRecommendProductsUsecase: GetRecommendProductsUsecaseInterface,
    @Inject('GetPostPurchaseSurveyUsecaseInterface')
    private getPostPurchaseSurveyUsecase: GetPostPurchaseSurveyUsecaseInterface,
    @Inject('PostPostPurchaseSurveyUsecaseInterface')
    private postPostPurchaseSurveyUsecase: PostPostPurchaseSurveyUsecaseInterface,
    @Inject('UpdateCustomerBoxUsecaseInterface')
    private updateCustomerBoxUsecase: UpdateCustomerBoxUsecaseInterface,
    @Inject('getPrePurchaseOptionsUsecaseInterface')
    private getPrePurchaseOptionsUsecase: getPrePurchaseOptionsUsecaseInterface,
    @Inject('PostPrePurchaseSurveyUsecaseInterface')
    private postPrePurchaseSurveyUsecase: PostPrePurchaseSurveyUsecaseInterface, // private teatisJob: TeatisJobs,
  ) {}

  // GET: /discovery
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

  // POST: /discovery/pre-purchase-survey
  @Post('pre-purchase-survey')
  async postPrePurchaseSurvey(
    @Body() body: PostPrePurchaseSurveyDto,
    @Res() response: Response,
  ): Promise<Response<PostPrePurchaseSurveyUsecaseRes | Error>> {
    const [res, error] =
      await this.postPrePurchaseSurveyUsecase.postPrePurchaseSurvey(body);

    if (error) {
      return response.status(500).send(error);
    }
    return response.status(200).send(res);
  }

  // GET: /discovery/all-options
  @Get('pre-purchase-options')
  async getPrePurchaseOptions(
    @Res() response: Response,
  ): Promise<Response<GetPrePurchaseOptionsUsecaseRes | Error>> {
    const [res, error] =
      await this.getPrePurchaseOptionsUsecase.getPrePurchaseOptions();

    if (error) {
      return response.status(500).send(error);
    }
    return response.status(200).send(res);
  }

  // GET: /discovery/post-purchase-survey
  @Get('post-purchase-survey')
  async getPostPurchaseSurvey(
    @Body() body: GetPostPurchaseSurveyInfoDto,
    @Res() response: Response,
  ): Promise<Response<any | Error>> {
    const email = body.email;
    const orderNumber = body.orderNumber;
    if (!email) throw new Error('No email is provided');

    const [res, error] =
      await this.getPostPurchaseSurveyUsecase.getPostPurchaseSurvey({
        email,
        orderNumber,
      });

    if (error) {
      return response.status(500).send(error);
    }
    return response.status(200).send(res);
  }

  // POST: /discovery/post-purchase-survey
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

  // POST: /discovery/order-creation-webhook
  @Post('order-creation-webhook')
  getWebhook(@Body() body: CreateOrderTaskDto) {
    console.log('start webhook');
    setTimeout(() => {
      console.log(body);
    }, 20000);
  }

  // POST: /discovery/update-customer-box-webhook
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

  // POST: /discovery/typeform
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
