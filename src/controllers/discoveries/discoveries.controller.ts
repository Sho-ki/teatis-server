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
import { GetNextBoxUsecaseInterface, GetNextBoxUsecaseRes } from '@Usecases/nextBox/getNextBox.usecase';
import { GetNextBoxDto } from './dtos/getNextBox';
import { CustomerCheckoutCart } from '@Domains/CustomerCheckoutCart';
import { CreateCheckoutCartDto } from './dtos/createCheckoutCartDto';
import { CreateCheckoutCartUsecaseInterface } from '../../usecases/checkoutCart/createCheckoutCart.usecase';

// api/discovery
@Controller('api/discovery')
@UsePipes(new ValidationPipe({ transform: true }))
export class DiscoveriesController {
  constructor(
    @Inject('GetNextBoxUsecaseInterface')
    private getNextBoxUsecase: GetNextBoxUsecaseInterface,
    @Inject('CreateCheckoutCartUsecaseInterface')
    private createCheckoutCartUsecase: CreateCheckoutCartUsecaseInterface,
  ) {}

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

}
