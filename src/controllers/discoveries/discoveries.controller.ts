import {
  Body,
  Controller,
  Get,
  Inject,
  Post,
  Query,
  Res,
  Session,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';

import { UpdateCustomerBoxDto } from './dtos/updateCustomerBox';
import { Response } from 'express';
import { TeatisJobs } from 'src/repositories/teatisJobs/dbMigrationjob';
import { GetPrePurchaseOptionsUsecaseInterface } from '@Usecases/prePurchaseSurvey/getPrePurchaseOptions.usecase';
import { UpdateCustomerBoxUsecaseInterface } from '@Usecases/customerBox/updateCustomerBox.usecase';
import { DeleteCustomerBoxDto } from './dtos/deleteCustomerBox';
import { DeleteCustomerBoxUsecaseInterface } from '@Usecases/customerBox/deleteCustomerBox.usecase';
import { GetNextBoxUsecaseInterface, GetNextBoxUsecaseRes } from '@Usecases/nextBox/getNextBox.usecase';
import { GetNextBoxDto } from './dtos/getNextBox';
import { GetCustomerNutritionDto } from './dtos/getCustomerNutrition';
import { GetCustomerNutritionUsecaseInterface } from '@Usecases/customerNutrition/getCustomerNutrition.usecase';
import { UpdatePractitionerBoxOrderHistoryUsecaseInterface } from '@Usecases/practitionerBoxOrder/updatePractitionerBoxOrderHistory.usecase';
import { GetFirstBoxDto } from './dtos/getFirstBox';
import { GetFirstBoxRes, GetFirstBoxUsecaseInterface } from '@Usecases/firstBox/getFirstBox.usecase';
import { CustomerCheckoutCart } from '@Domains/CustomerCheckoutCart';
import { Status } from '@Domains/Status';
import { ProductOptions } from '@Domains/ProductOptions';
import { NutritionNeed } from '@Domains/NutritionNeed';
import { CreateCheckoutCartDto } from './dtos/createCheckoutCartDto';
import { CreateCheckoutCartUsecaseInterface } from '../../usecases/checkoutCart/createCheckoutCart.usecase';

// api/discovery
@Controller('api/discovery')
@UsePipes(new ValidationPipe({ transform: true }))
export class DiscoveriesController {
  constructor(
    @Inject('GetPrePurchaseOptionsUsecaseInterface')
    private getPrePurchaseOptionsUsecase: GetPrePurchaseOptionsUsecaseInterface,
    @Inject('UpdateCustomerBoxUsecaseInterface')
    private updateCustomerBoxUsecase: UpdateCustomerBoxUsecaseInterface,
    @Inject('DeleteCustomerBoxUsecaseInterface')
    private deleteCustomerBoxUsecase: DeleteCustomerBoxUsecaseInterface,
    @Inject('GetNextBoxUsecaseInterface')
    private getNextBoxUsecase: GetNextBoxUsecaseInterface,
    @Inject('GetCustomerNutritionUsecaseInterface')
    private getCustomerNutritionUsecase: GetCustomerNutritionUsecaseInterface,
    @Inject('UpdatePractitionerBoxOrderHistoryUsecaseInterface')
    private updatePractitionerBoxOrderHistoryUsecase: UpdatePractitionerBoxOrderHistoryUsecaseInterface,
    @Inject('GetFirstBoxUsecaseInterface')
    private getFirstBoxUsecase: GetFirstBoxUsecaseInterface,
    @Inject('CreateCheckoutCartUsecaseInterface')
    private createCheckoutCartUsecase: CreateCheckoutCartUsecaseInterface,
    private teatisJob: TeatisJobs,
  ) {}

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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    @Session() session: Record<string, any>,
    @Body() body: CreateCheckoutCartDto,
    @Res() response: Response<CustomerCheckoutCart | Error>,
  ) {
    session['sessionId'] = session['sessionId'] || session.id;

    const [usecaseResponse, error] =
      await this.createCheckoutCartUsecase.createCheckoutCart(
        { ...body, sessionId: session['sessionId'] }
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
