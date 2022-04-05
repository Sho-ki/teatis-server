import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Post,
  Query,
  Res,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';

import { GetPostPurchaseSurveyInfoDto } from './dtos/getPostPurchaseSurvey';
import { UpdateCustomerOrderDto } from './dtos/updateCustomerOrder';
import { PostPostPurchaseSurveyDto } from './dtos/postPostPurchaseSurvey';
import { GetPostPurchaseSurveyUsecaseInterface } from '@Usecases/postPurcahseSurvey/getPostPurchaseSurvey.usecase';
import { PostPostPurchaseSurveyUsecaseInterface } from '@Usecases/postPurcahseSurvey/postPostPurchaseSurvey.usecase';

import { UpdateCustomerBoxDto } from './dtos/updateCustomerBox';
import { Response } from 'express';
import { TeatisJobs } from 'src/repositories/teatisJobs/dbMigrationjob';
import {
  GetPrePurchaseOptionsUsecaseInterface,
  GetPrePurchaseOptionsUsecaseRes,
} from '@Usecases/prePurchaseSurvey/getPrePurchaseOptions.usecase';
import { UpdateCustomerBoxUsecaseInterface } from '@Usecases/customerBoxUpdate/updateCustomerBox.usecase';
import { PostPrePurchaseSurveyDto } from './dtos/postPrePurchaseSurvey';
import {
  PostPrePurchaseSurveyUsecaseInterface,
  PostPrePurchaseSurveyUsecaseRes,
} from '../../usecases/prePurchaseSurvey/postPrePurchaseSurvey.usecase';
import { UpdateCustomerOrderUsecaseInterface } from '../../usecases/customerOrderCreate/updateCustomerOrder.usecase';
import { DeleteCustomerBoxDto } from './dtos/deleteCustomerBox';
import { DeleteCustomerBoxUsecaseInterface } from '../../usecases/customerBoxUpdate/deleteCustomerBox.usecase';
import { GetNextBoxUsecaseInterface } from '../../usecases/nextBoxSurvey/getNextBoxSurvey.usecase';
import { GetNextBoxSurveyDto } from './dtos/getNextBoxSurvey';
import { GetFirstBoxProductsUsecaseInterface } from '../../usecases/prePurchaseSurvey/getFirstBoxProducts.usecase';

// api/discovery
@Controller('api/discovery')
@UsePipes(new ValidationPipe({ transform: true }))
export class DiscoveriesController {
  constructor(
    @Inject('GetPostPurchaseSurveyUsecaseInterface')
    private getPostPurchaseSurveyUsecase: GetPostPurchaseSurveyUsecaseInterface,
    @Inject('PostPostPurchaseSurveyUsecaseInterface')
    private postPostPurchaseSurveyUsecase: PostPostPurchaseSurveyUsecaseInterface,
    @Inject('GetPrePurchaseOptionsUsecaseInterface')
    private getPrePurchaseOptionsUsecase: GetPrePurchaseOptionsUsecaseInterface,
    @Inject('PostPrePurchaseSurveyUsecaseInterface')
    private postPrePurchaseSurveyUsecase: PostPrePurchaseSurveyUsecaseInterface,
    @Inject('UpdateCustomerBoxUsecaseInterface')
    private updateCustomerBoxUsecase: UpdateCustomerBoxUsecaseInterface,
    @Inject('UpdateCustomerOrderUsecaseInterface')
    private updateCustomerOrderUsecase: UpdateCustomerOrderUsecaseInterface,
    @Inject('DeleteCustomerBoxUsecaseInterface')
    private deleteCustomerBoxUsecase: DeleteCustomerBoxUsecaseInterface,
    @Inject('GetNextBoxUsecaseInterface')
    private getNextBoxSurveyUsecase: GetNextBoxUsecaseInterface,
    @Inject('GetFirstBoxProductsUsecaseInterface')
    private getFirstBoxProductsUsecase: GetFirstBoxProductsUsecaseInterface,
    private teatisJob: TeatisJobs,
  ) {}

  // POST: api/discovery/pre-purchase-survey
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
    return response.status(201).send(res);
  }

  // GET: api/discovery/pre-purchase-options
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

  // GET: api/discovery/post-purchase-survey
  @Get('post-purchase-survey')
  async getPostPurchaseSurvey(
    @Query() body: GetPostPurchaseSurveyInfoDto,
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

  // GET: api/discovery/first-box-products
  @Get('first-box-products')
  async getFirstProducts(
    @Query('id') id: string,
    @Res() response: Response,
  ): Promise<Response<any | Error>> {
    const [res, error] =
      await this.getFirstBoxProductsUsecase.getFirstBoxProducts(id);

    if (error) {
      return response.status(500).send(error);
    }
    return response.status(200).send(res);
  }

  // GET: api/discovery/next-box-survey
  @Get('next-box-survey')
  async getNextBoxSurvey(
    @Query() body: GetNextBoxSurveyDto,
    @Res() response: Response,
  ): Promise<Response<any | Error>> {
    const [res, error] = await this.getNextBoxSurveyUsecase.getNextBoxSurvey({
      email: body.email,
      productCount: 30,
    });

    if (error) {
      return response.status(500).send(error);
    }
    return response.status(200).send(res);
  }

  // POST: api/discovery/post-purchase-survey
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
    return response.status(201).send(res);
  }

  // POST: api/discovery/delete-customer-box-webhook
  @Post('delete-customer-box-webhook')
  async deleteCustomerBox(
    @Body() body: DeleteCustomerBoxDto,
    @Res() response: Response,
  ): Promise<Response<any | Error>> {
    const [res, error] = await this.deleteCustomerBoxUsecase.deleteCustomerBox(
      body,
    );
    if (error) {
      return response.status(500).send(error);
    }
    return response.status(200).send({ status: res.status });
  }

  // POST: api/discovery/order-update-webhook
  @Post('order-update-webhook')
  async createOrder(
    @Body() body: UpdateCustomerOrderDto,
    @Res() response: Response,
  ): Promise<Response<any | Error>> {
    const [res, error] =
      await this.updateCustomerOrderUsecase.updateCustomerOrder(body);
    if (error) {
      return response.status(500).send(error);
    }
    return response.status(200).send({ status: res.status });
  }

  // POST: api/discovery/update-customer-box
  @Post('update-customer-box')
  async createCustomerBox(
    @Body() body: UpdateCustomerBoxDto,
    @Res() response: Response,
  ) {
    const [res, error] = await this.updateCustomerBoxUsecase.updateCustomerBox(
      body,
    );
    if (error) {
      return response.status(500).send(error);
    }
    return response.status(201).send(res);
  }

  // When you migrate the data (Discoveries -> Customer etc...)
  @Post('job')
  async dataMigrate() {
    // await this.teatisJob.databaseMigrate();
    await this.teatisJob.addUUID();

    return;
  }
}
