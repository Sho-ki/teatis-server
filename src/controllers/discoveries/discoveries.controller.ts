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
import { UpdateCustomerBoxUsecaseInterface } from '@Usecases/customerBox/updateCustomerBox.usecase';
import { PostPrePurchaseSurveyDto } from './dtos/postPrePurchaseSurvey';
import { PostPrePurchaseSurveyUsecaseInterface } from '@Usecases/prePurchaseSurvey/postPrePurchaseSurvey.usecase';
import { UpdateCustomerOrderByCustomerUuidUsecaseInterface } from '@Usecases/customerOrder/updateCustomerOrderByCustomerUuid.usecase';
import { DeleteCustomerBoxDto } from './dtos/deleteCustomerBox';
import { DeleteCustomerBoxUsecaseInterface } from '@Usecases/customerBox/deleteCustomerBox.usecase';
import { GetNextBoxUsecaseInterface } from '@Usecases/nextBoxSurvey/getNextBoxSurvey.usecase';
import { GetNextBoxSurveyDto } from './dtos/getNextBoxSurvey';
import { GetCustomerNutritionDto } from './dtos/getCustomerNutrition';
import { GetCustomerNutritionUsecaseInterface } from '@Usecases/customerNutrition/getCustomerNutrition.usecase';
import { CreateCheckoutCartOfCustomerOriginalBoxUsecaseInterface } from '@Usecases/checkoutCart/createCheckoutCartOfCustomerOriginalBox.usecase';
import { CreateCheckoutCartOfCustomerOriginalBoxDto } from './dtos/createCheckoutCartOfCustomerOriginalBoxDto';
import { UpdateCustomerOrderByPractitionerBoxUuidUsecaseInterface } from '@Usecases/customerOrder/updateCustomerOrderByPractitionerBoxUuid.usecase';
import { OrderQueue } from '@Domains/OrderQueue';
import { CreateCheckoutCartOfPractitionerBoxUsecaseInterface } from '@Usecases/checkoutCart/createCheckoutCartOfPractitionerBox.usecase';
import { CreateCheckoutCartOfPractitionerBoxDto } from './dtos/createCheckoutCartOfPractitionerBoxDto';
import { UpdatePractitionerBoxOrderHistoryUsecaseInterface } from '../../usecases/practitionerBoxOrder/updatePractitionerBoxOrderHistory.usecase';

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
    @Inject('UpdateCustomerOrderByCustomerUuidUsecaseInterface')
    private updateCustomerOrderByCustomerUuidUsecase: UpdateCustomerOrderByCustomerUuidUsecaseInterface,
    @Inject('DeleteCustomerBoxUsecaseInterface')
    private deleteCustomerBoxUsecase: DeleteCustomerBoxUsecaseInterface,
    @Inject('GetNextBoxUsecaseInterface')
    private getNextBoxSurveyUsecase: GetNextBoxUsecaseInterface,
    @Inject('CreateCheckoutCartOfCustomerOriginalBoxUsecaseInterface')
    private createCheckoutCartOfCustomerOriginalBoxUsecase: CreateCheckoutCartOfCustomerOriginalBoxUsecaseInterface,
    @Inject('GetCustomerNutritionUsecaseInterface')
    private getCustomerNutritionUsecase: GetCustomerNutritionUsecaseInterface,
    @Inject('UpdateCustomerOrderByPractitionerBoxUuidUsecaseInterface')
    private updateCustomerOrderByPractitionerBoxUuidUsecase: UpdateCustomerOrderByPractitionerBoxUuidUsecaseInterface,
    @Inject('CreateCheckoutCartOfPractitionerBoxUsecaseInterface')
    private createCheckoutCartOfPractitionerBoxUsecase: CreateCheckoutCartOfPractitionerBoxUsecaseInterface,
    @Inject('UpdatePractitionerBoxOrderHistoryUsecaseInterface')
    private updatePractitionerBoxOrderHistoryUsecase: UpdatePractitionerBoxOrderHistoryUsecaseInterface,

    private teatisJob: TeatisJobs,
  ) {}

  // POST: api/discovery/pre-purchase-survey
  @Post('pre-purchase-survey')
  async postPrePurchaseSurvey(
    @Body() body: PostPrePurchaseSurveyDto,
    @Res() response: Response,
  ): Promise<Response<any | Error>> {
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

  // GET: api/discovery/next-box-survey
  @Get('next-box-survey')
  async getNextBoxSurvey(
    @Query() body: GetNextBoxSurveyDto,
    @Res() response: Response,
  ): Promise<Response<any | Error>> {
    const isFirstBox = body.uuid ? true : false;
    const [res, error] = await this.getNextBoxSurveyUsecase.getNextBoxSurvey({
      email: body.email,
      uuid: body.uuid,
      productCount: isFirstBox ? 15 : 30,
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
    const noteAttributesKey = body.note_attributes[0]?.name as
      | 'practitionerBoxUuid'
      | 'uuid'
      | undefined;
    if (noteAttributesKey === 'practitionerBoxUuid') {
      const [res, error] =
        await this.updatePractitionerBoxOrderHistoryUsecase.updatePractitionerOrderHistory(
          body,
        );
      if (error) {
        return response.status(500).send(error);
      }
      return response.status(200).send({ status: 'OK' });
    } else {
      const [res, error] =
        await this.deleteCustomerBoxUsecase.deleteCustomerBox(body);
      if (error) {
        return response.status(500).send(error);
      }
      return response.status(200).send({ status: res.status });
    }
  }

  // POST: api/discovery/order-update-webhook
  @Post('order-update-webhook')
  async createOrder(
    @Body() body: UpdateCustomerOrderDto,
    @Res() response: Response,
  ): Promise<Response<any | Error>> {
    const noteAttributesKey = body.note_attributes[0]?.name as
      | 'practitionerBoxUuid'
      | 'uuid'
      | undefined;
    let [res, error]: [OrderQueue, Error] = [undefined, undefined];
    if (noteAttributesKey === 'practitionerBoxUuid') {
      [res, error] =
        await this.updateCustomerOrderByPractitionerBoxUuidUsecase.updateCustomerOrderByPractitionerBoxUuid(
          body,
        );
    } else {
      [res, error] =
        await this.updateCustomerOrderByCustomerUuidUsecase.updateCustomerOrderByCustomerUuid(
          body,
        );
    }
    if (error) {
      return response.status(500).send(error);
    }
    return response.status(200).send(res);
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

  // Post: api/discovery/customer-original-box-cart
  @Post('customer-original-box-cart')
  async createCheckoutCartOfCustomerOriginalBox(
    @Body() body: CreateCheckoutCartOfCustomerOriginalBoxDto,
    @Res() response: Response,
  ) {
    const [res, error] =
      await this.createCheckoutCartOfCustomerOriginalBoxUsecase.createCheckoutCartOfCustomerOriginalBox(
        body,
      );
    if (error) {
      return response.status(500).send(error);
    }
    return response.status(201).send(res);
  }

  // Post: api/discovery/practitioner-box-cart
  @Post('practitioner-box-cart')
  async createPractitionerBoxCart(
    @Body() body: CreateCheckoutCartOfPractitionerBoxDto,
    @Res() response: Response,
  ) {
    const [res, error] =
      await this.createCheckoutCartOfPractitionerBoxUsecase.createCheckoutCartOfPractitionerBox(
        body,
      );
    if (error) {
      return response.status(500).send(error);
    }
    return response.status(201).send(res);
  }

  // Get: api/discovery/customer-nutrition
  @Get('customer-nutrition')
  async getCustomerNutrition(
    @Query() body: GetCustomerNutritionDto,
    @Res() response: Response,
  ) {
    const [res, error] =
      await this.getCustomerNutritionUsecase.getCustomerNutrition(body);
    if (error) {
      return response.status(500).send(error);
    }
    return response.status(200).send(res);
  }

  // When you migrate the data (Discoveries -> Customer etc...)
  // @Post('job')
  // async dataMigrate() {
  //   // await this.teatisJob.databaseMigrate();
  //   const res = await this.teatisJob.getCustomerBox();

  //   return res;
  // }
}
