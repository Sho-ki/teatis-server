import { Body, Controller, Inject,  Post, Res } from '@nestjs/common';
import { Customer } from '../../domains/Customer';
import { CancelSubscriptionUsecaseInterface } from '@Usecases/recharge/cancelSubscription.usecase';
import { CancelSubscriptionDto } from './dto/cancelSubscription.dto';
import { Response } from 'express';

@Controller('api/recharge/subscription')
export class SubscriptionController {
  constructor(
@Inject('CancelSubscriptionUsecaseInterface')
  private readonly cancelSubscriptionUsecase:CancelSubscriptionUsecaseInterface
  ) {}

  // Post: api/recharge/subscription/cancel
  @Post('cancel')
  async cancelSubscription(
    @Body() body: CancelSubscriptionDto,
    @Res() response: Response<Customer | Error>,
  ) {
    const [usecase, error] = await this.cancelSubscriptionUsecase.cancelSubscription(
      { subscription: body.subscription });

    if(error){
      return response.status(500).send(error);
    }
    return response.status(201).send(usecase);
  }

}
