import {  Inject, Injectable, Res } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';

import { Response } from 'express';
import { CheckUpdateOrderUsecaseInterface } from '@Usecases/webhookEvent/checkUpdateOrder.usecase';
import { Status } from '@Domains/Status';

@Injectable()
export class WebhookEventService {
  constructor(
    @Inject('CheckUpdateOrderUsecaseInterface')
    private checkUpdateOrderUsecase: CheckUpdateOrderUsecaseInterface,
  ) {}

  @Cron('* * * * * *')
  async checkUpdateOrderWebhook(@Res() response: Response<Status | Error>) {

    const [usecaseResponse, error] =
      await this.checkUpdateOrderUsecase.checkUpdateOrder();
    if (error) {
      return response.status(500).send(error);
    }
    return response.status(200).send(usecaseResponse);
  }
}
