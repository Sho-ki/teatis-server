import { Controller, Inject, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import { CheckUpdateOrderUsecaseInterface } from '@Usecases/webhookEvent/checkUpdateOrder.usecase';
import { Status } from '@Domains/Status';

@Controller('api/system')
export class WebhookEventController {
  constructor(
    @Inject('CheckUpdateOrderUsecaseInterface')
    private checkUpdateOrderUsecase: CheckUpdateOrderUsecaseInterface,
  ) {}
  @Post('webhook-event')
  async checkUpdateOrderWebhook(@Res() response: Response<Status | Error>) {
    const [usecaseResponse, error] =
      await this.checkUpdateOrderUsecase.checkUpdateOrder();
    if (error) {
      return response.status(500).send(error);
    }
    return response.status(200).send(usecaseResponse);
  }
}
