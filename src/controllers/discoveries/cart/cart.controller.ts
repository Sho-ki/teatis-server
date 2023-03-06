import {
  Body,
  Controller,
  Inject,
  Post,
  Res,
  Session,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';

import { Response } from 'express';
import { CustomerCheckoutCart } from '@Domains/CustomerCheckoutCart';
import { CreateCheckoutCartUsecaseInterface } from '../../../usecases/checkoutCart/createCheckoutCart.usecase';
import { CreateCheckoutCartDto } from './dtos/createCheckoutCartDto';

// api/discovery
@Controller('api/discovery')
@UsePipes(new ValidationPipe({ transform: true }))
export class CartController {
  constructor(
    @Inject('CreateCheckoutCartUsecaseInterface')
    private createCheckoutCartUsecase: CreateCheckoutCartUsecaseInterface,
  ) {}

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
