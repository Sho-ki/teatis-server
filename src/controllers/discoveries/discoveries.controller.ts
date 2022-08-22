import {
  Body,
  Controller,
  Get,
  Inject,
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
import { GetPrePurchaseOptionsUsecaseInterface } from '@Usecases/prePurchaseSurvey/getPrePurchaseOptions.usecase';
import { UpdateCustomerBoxUsecaseInterface } from '@Usecases/customerBox/updateCustomerBox.usecase';
import { PostPrePurchaseSurveyDto } from './dtos/postPrePurchaseSurvey';
import { PostPrePurchaseSurveyUsecaseInterface } from '@Usecases/prePurchaseSurvey/postPrePurchaseSurvey.usecase';
import { UpdateCustomerOrderOfCustomerBoxUsecaseInterface } from '@Usecases/customerOrder/updateCustomerOrderOfCustomerBox.usecase';
import { DeleteCustomerBoxDto } from './dtos/deleteCustomerBox';
import { DeleteCustomerBoxUsecaseInterface } from '@Usecases/customerBox/deleteCustomerBox.usecase';
import { GetNextBoxUsecaseInterface, GetNextBoxUsecaseRes } from '@Usecases/nextBox/getNextBox.usecase';
import { GetNextBoxDto } from './dtos/getNextBox';
import { GetCustomerNutritionDto } from './dtos/getCustomerNutrition';
import { GetCustomerNutritionUsecaseInterface } from '@Usecases/customerNutrition/getCustomerNutrition.usecase';
import { UpdateCustomerOrderOfPractitionerBoxUsecaseInterface } from '@Usecases/customerOrder/updateCustomerOrderOfPractitionerBox.usecase';
import { OrderQueue } from '@Domains/OrderQueue';
import { CreateCheckoutCartOfPractitionerBoxOldUsecaseInterface } from '@Usecases/checkoutCart/createCheckoutCartOfPractitionerBoxOld.usecase';
import { CreateCheckoutCartOfPractitionerBoxOldDto } from './dtos/createCheckoutCartOfPractitionerBoxOldDto';
import { UpdatePractitionerBoxOrderHistoryUsecaseInterface } from '@Usecases/practitionerBoxOrder/updatePractitionerBoxOrderHistory.usecase';
import { GetFirstBoxDto } from './dtos/getFirstBox';
import { GetFirstBoxRes, GetFirstBoxUsecaseInterface } from '@Usecases/firstBox/getFirstBox.usecase';
import { CreateCheckoutCartOfPractitionerMealBoxDto } from './dtos/createCheckoutCartOfPractitionerMealBox';
import { CreateCheckoutCartOfPractitionerMealBoxUsecaseInterface } from '@Usecases/checkoutCart/createCheckoutCartOfPractitionerMealBox.usecase';
import { UpdateCustomerOrderOfPractitionerMealBoxUsecaseInterface } from '@Usecases/customerOrder/updateCustomerOrderOfPractitionerMealBox.usecase';
import { CustomerCheckoutCart } from '@Domains/CustomerCheckoutCart';
import { Status } from '@Domains/Status';
import { PostPurchaseSurveyAnswer } from '@Domains/PostPurchaseSurveyAnswer';
import { PostPurchaseSurvey } from '@Domains/PostPurchaseSurvey';
import { ProductOptions } from '@Domains/ProductOptions';
import { CustomerBoxType } from '@Domains/CustomerBoxType';
import { NutritionNeed } from '../../domains/NutritionNeed';
import { CreateCheckoutCartOfCustomerBoxUsecaseInterface } from '../../usecases/checkoutCart/createCheckoutCartOfCustomerBox.usecase';
import { CreateCheckoutCartDto } from './dtos/createCheckoutCartOfCustomerBoxDto';
import { CreateCheckoutCartOfPractitionerBoxUsecaseInterface } from '../../usecases/checkoutCart/createCheckoutCartOfPractitionerBox.usecase';

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
    @Inject('UpdateCustomerOrderOfCustomerBoxUsecaseInterface')
    private updateCustomerOrderOfCustomerBoxUsecase: UpdateCustomerOrderOfCustomerBoxUsecaseInterface,
    @Inject('DeleteCustomerBoxUsecaseInterface')
    private deleteCustomerBoxUsecase: DeleteCustomerBoxUsecaseInterface,
    @Inject('GetNextBoxUsecaseInterface')
    private getNextBoxUsecase: GetNextBoxUsecaseInterface,
    @Inject('CreateCheckoutCartOfCustomerBoxUsecaseInterface')
    private createCheckoutCartOfCustomerBoxUsecase: CreateCheckoutCartOfCustomerBoxUsecaseInterface,
    @Inject('GetCustomerNutritionUsecaseInterface')
    private getCustomerNutritionUsecase: GetCustomerNutritionUsecaseInterface,
    @Inject('UpdateCustomerOrderOfPractitionerBoxUsecaseInterface')
    private updateCustomerOrderOfPractitionerBoxUsecase: UpdateCustomerOrderOfPractitionerBoxUsecaseInterface,
    @Inject('CreateCheckoutCartOfPractitionerBoxOldUsecaseInterface')
    private createCheckoutCartOfPractitionerBoxOldUsecase: CreateCheckoutCartOfPractitionerBoxOldUsecaseInterface,
    @Inject('UpdatePractitionerBoxOrderHistoryUsecaseInterface')
    private updatePractitionerBoxOrderHistoryUsecase: UpdatePractitionerBoxOrderHistoryUsecaseInterface,
    @Inject('GetFirstBoxUsecaseInterface')
    private getFirstBoxUsecase: GetFirstBoxUsecaseInterface,
    @Inject('CreateCheckoutCartOfPractitionerMealBoxUsecaseInterface')
    private createCheckoutCartOfPractitionerMealBoxUsecase: CreateCheckoutCartOfPractitionerMealBoxUsecaseInterface,
    @Inject('UpdateCustomerOrderOfPractitionerMealBoxUsecaseInterface')
    private updateCustomerOrderOfPractitionerMealBoxUsecase: UpdateCustomerOrderOfPractitionerMealBoxUsecaseInterface,
    @Inject('CreateCheckoutCartOfPractitionerBoxUsecaseInterface')
    private CreateCheckoutCartOfPractitionerBoxUsecase: CreateCheckoutCartOfPractitionerBoxUsecaseInterface,
    private teatisJob: TeatisJobs,
  ) {}

  // POST: api/discovery/pre-purchase-survey
  @Post('pre-purchase-survey')
  async postPrePurchaseSurvey(
    @Body() body: PostPrePurchaseSurveyDto,
    @Res() response: Response<CustomerBoxType | Error>,
  ) {
    const [usecaseResponse, error] =
      await this.postPrePurchaseSurveyUsecase.postPrePurchaseSurvey(body);
    if (error) {
      return response.status(500).send(error);
    }

    return response.status(201).send(usecaseResponse);
  }

  // GET: api/discovery/pre-purchase-options
  @Get('pre-purchase-options')
  async getPrePurchaseOptions(
    @Res() response: Response<ProductOptions | Error>,
  ) {
    const [usecaseResponse, error] =
      await this.getPrePurchaseOptionsUsecase.getPrePurchaseOptions();

    if (error) {
      return response.status(500).send(error);
    }

    return response.status(200).send(usecaseResponse);
  }

  // GET: api/discovery/post-purchase-survey
  @Get('post-purchase-survey')
  async getPostPurchaseSurvey(
    @Query() body: GetPostPurchaseSurveyInfoDto,
    @Res() response: Response<PostPurchaseSurvey | Error>,
  ) {
    const uuid = body.uuid;
    const orderNumber = body.orderNumber;

    const [usecaseResponse, error] =
      await this.getPostPurchaseSurveyUsecase.getPostPurchaseSurvey({
        uuid,
        orderNumber,
      });

    if (error) {
      return response.status(500).send(error);
    }
    return response.status(200).send(usecaseResponse);
  }

  // GET: api/discovery/next-box-survey
  @Get('next-box-survey')
  async getNextBox(
    @Query() body: GetNextBoxDto,
    @Res() response: Response<GetNextBoxUsecaseRes | Error>,
  ) {
    const [usecaseResponse, error] = await this.getNextBoxUsecase.getNextBox(
      body,
    );

    if (error) {
      return response.status(500).send(error);
    }
    return response.status(200).send(usecaseResponse);
  }

  // GET: api/discovery/first-box
  @Get('first-box')
  async getFirstBox(
    @Query() body: GetFirstBoxDto,
    @Res() response: Response<GetFirstBoxRes | Error>,
  ) {
    const [usecaseResponse, error] = await this.getFirstBoxUsecase.getFirstBox(
      body,
    );

    if (error) {
      return response.status(500).send(error);
    }
    return response.status(200).send(usecaseResponse);
  }

  // POST: api/discovery/post-purchase-survey
  @Post('post-purchase-survey')
  async postPostPurchaseSurvey(
    @Body() body: PostPostPurchaseSurveyDto,
    @Res() response: Response<PostPurchaseSurveyAnswer | Error>,
  ) {
    const [usecaseResponse, error] =
      await this.postPostPurchaseSurveyUsecase.postPostPurchaseSurvey(body);
    if (error) {
      return response.status(500).send(error);
    }
    return response.status(201).send(usecaseResponse);
  }

  // POST: api/discovery/delete-customer-box-webhook
  @Post('delete-customer-box-webhook')
  async deleteCustomerBox(
    @Body() body: DeleteCustomerBoxDto,
    @Res() response: Response<Status | Error>,
  ) {
    let noteAttributes = {} as { uuid?: string, practitionerBoxUuid?: string };
    for (const noteAttribute of body.note_attributes) {
      if (noteAttribute.name === 'uuid') {
        noteAttributes = Object.assign(noteAttributes, { uuid: noteAttribute.value });
      }
      if (noteAttribute.name === 'practitionerBoxUuid') {
        noteAttributes = Object.assign(noteAttributes, { practitionerBoxUuid: noteAttribute.value });
      }
    }
    const noteAttributesKeys = Object.keys(noteAttributes);

    if (noteAttributesKeys.includes('practitionerBoxUuid')) {
      const [usecaseResponse, error] =
        await this.updatePractitionerBoxOrderHistoryUsecase.updatePractitionerOrderHistory(
          body,
        );
      if (error) {
        return response.status(500).send(error);
      }
      return response.status(200).send(usecaseResponse);
    } else {
      const [usecaseResponse, error] =
        await this.deleteCustomerBoxUsecase.deleteCustomerBox(body);
      if (error) {
        return response.status(500).send(error);
      }
      return response.status(200).send(usecaseResponse);
    }
  }

  // POST: api/discovery/order-update-webhook
  @Post('order-update-webhook')
  async createOrder(
    @Body() body: UpdateCustomerOrderDto,
    @Res() response:  Response<OrderQueue | Error>,
  ) {
    let noteAttributes = {} as { uuid?: string, practitionerBoxUuid?: string };
    for (const noteAttribute of body.note_attributes) {
      if (noteAttribute.name === 'uuid') {
        noteAttributes = Object.assign(noteAttributes, { uuid: noteAttribute.value });
      }
      if (noteAttribute.name === 'practitionerBoxUuid') {
        noteAttributes = Object.assign(noteAttributes, { practitionerBoxUuid: noteAttribute.value });
      }
    }
    const noteAttributesKeys = Object.keys(noteAttributes);
    let [usecaseResponse, error]: [OrderQueue, Error] = [undefined, undefined];
    if (
      noteAttributesKeys.includes('practitionerBoxUuid') &&
      noteAttributesKeys.includes('uuid')
    ) {
      [usecaseResponse, error] =
        await this.updateCustomerOrderOfPractitionerBoxUsecase.updateCustomerOrderOfPractitionerBox(
          {
            name: body.name,
            customer: body.customer,
            subtotal_price: body.subtotal_price,
            line_items: body.line_items,
            uuid: noteAttributes.uuid,
            practitionerBoxUuid: noteAttributes.practitionerBoxUuid,
          },
        );

    } else {
      [usecaseResponse, error] =
        await this.updateCustomerOrderOfCustomerBoxUsecase.updateCustomerOrderOfCustomerBox(
          {
            name: body.name,
            customer: body.customer,
            line_items: body.line_items,
            uuid: noteAttributes.uuid,
          },
        );
    }
    if (error) {
      return response.status(500).send(error);
    }
    return response.status(200).send(usecaseResponse);
  }

  // POST: api/discovery/update-customer-box
  @Post('update-customer-box')
  async createCustomerBox(
    @Body() body: UpdateCustomerBoxDto,
    @Res() response: Response<Status | Error>,
  ) {
    const [usecaseResponse, error] =
      await this.updateCustomerBoxUsecase.updateCustomerBox(body);
    if (error) {
      return response.status(500).send(error);
    }
    return response.status(201).send(usecaseResponse);
  }

  // Post: api/discovery/box-cart
  @Post('box-cart')
  async createCheckoutCartOfCustomerBox(
    @Body() body: CreateCheckoutCartDto,
    @Res() response: Response<CustomerCheckoutCart | Error>,
  ) {
    const { boxType } = body;

    if(boxType === 'CustomerBox'){
      const [usecaseResponse, error] =
      await this.createCheckoutCartOfCustomerBoxUsecase.createCheckoutCartOfCustomerBox(
        body,
      );
      if (error) {
        return response.status(500).send(error);
      }
      return response.status(201).send(usecaseResponse);
    } else if(boxType === 'PractitionerBox'){
      const [usecaseResponse, error] =
      await this.CreateCheckoutCartOfPractitionerBoxUsecase.createCheckoutCartOfPractitionerBox(
        body,
      );
      if (error) {
        return response.status(500).send(error);
      }
      return response.status(201).send(usecaseResponse);

    }

  }

  // Post: api/discovery/practitioner-box-cart
  @Post('practitioner-box-cart')
  async createPractitionerBoxCart(
    @Body() body: CreateCheckoutCartOfPractitionerBoxOldDto,
    @Res() response:  Response<CustomerCheckoutCart | Error>,
  ) {
    const [usecaseResponse, error] =
      await this.createCheckoutCartOfPractitionerBoxOldUsecase.createCheckoutCartOfPractitionerBoxOld(
        body,
      );
    if (error) {
      return response.status(500).send(error);
    }
    return response.status(201).send(usecaseResponse);
  }

  // Post: api/discovery/practitioner-meal-box-cart
  @Post('practitioner-meal-box-cart')
  async createPractitionerMealBoxCart(
    @Body() body: CreateCheckoutCartOfPractitionerMealBoxDto,
    @Res() response: Response<CustomerCheckoutCart | Error>,
  ) {
    const [usecaseResponse, error] =
      await this.createCheckoutCartOfPractitionerMealBoxUsecase.createCheckoutCartOfPractitionerMealBox(
        body,
      );
    if (error) {
      return response.status(500).send(error);
    }
    return response.status(201).send(usecaseResponse);
  }

  // Get: api/discovery/customer-nutrition
  @Get('customer-nutrition')
  async getCustomerNutrition(
    @Query() body: GetCustomerNutritionDto,
    @Res() response: Response<NutritionNeed | Error>,
  ) {
    const [usecaseResponse, error] =
      await this.getCustomerNutritionUsecase.getCustomerNutrition(body);
    if (error) {
      return response.status(500).send(error);
    }
    return response.status(200).send(usecaseResponse);
  }

  // When you migrate the data (Discoveries -> Customer etc...)
  // @Post('job')
  // async dataMigrate() {
  //   // await this.teatisJob.databaseMigrate();
  //   // const res = await this.teatisJob.getCustomerBox();
  //   const res = await this.teatisJob.flavorIntegrate();
  //   // const res = await this.teatisJob.allergenIntegrate();

  //   return res;
  // }
}
