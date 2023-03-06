import {
  Controller,
  Get,
  Inject,
  Query,
  Res,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';

import { Response } from 'express';
import { GetPrePurchaseOptionsUsecaseInterface } from '@Usecases/prePurchaseSurvey/getPrePurchaseOptions.usecase';
import { GetNextBoxUsecaseInterface, GetNextBoxUsecaseRes } from '@Usecases/nextBox/getNextBox.usecase';
import { GetNextBoxDto } from './dtos/getNextBox';
import { ProductOptions } from '@Domains/ProductOptions';

// api/discovery
@Controller('api/discovery')
@UsePipes(new ValidationPipe({ transform: true }))
export class DiscoveriesController {
  constructor(
    @Inject('GetPrePurchaseOptionsUsecaseInterface')
    private getPrePurchaseOptionsUsecase: GetPrePurchaseOptionsUsecaseInterface,
    @Inject('GetNextBoxUsecaseInterface')
    private getNextBoxUsecase: GetNextBoxUsecaseInterface,
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

}
