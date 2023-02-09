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

import { Response } from 'express';
import { TeatisJobs } from 'src/repositories/teatisJobs/dbMigrationjob';
import { GetPrePurchaseOptionsUsecaseInterface } from '@Usecases/prePurchaseSurvey/getPrePurchaseOptions.usecase';
import { GetNextBoxUsecaseInterface, GetNextBoxUsecaseRes } from '@Usecases/nextBox/getNextBox.usecase';
import { GetNextBoxDto } from './dtos/getNextBox';
import { CustomerCheckoutCart } from '@Domains/CustomerCheckoutCart';
import { ProductOptions } from '@Domains/ProductOptions';
import { CreateCheckoutCartDto } from './dtos/createCheckoutCartDto';
import { CreateCheckoutCartUsecaseInterface } from '../../usecases/checkoutCart/createCheckoutCart.usecase';

// api/discovery
@Controller('api/discovery')
@UsePipes(new ValidationPipe({ transform: true }))
export class DiscoveriesController {
  constructor(
    @Inject('GetPrePurchaseOptionsUsecaseInterface')
    private getPrePurchaseOptionsUsecase: GetPrePurchaseOptionsUsecaseInterface,
    @Inject('GetNextBoxUsecaseInterface')
    private getNextBoxUsecase: GetNextBoxUsecaseInterface,
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
