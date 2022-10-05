import {  Inject, Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';

import { CheckUpdateOrderUsecaseInterface } from '@Usecases/webhookEvent/checkUpdateOrder.usecase';

@Injectable()
export class WebhookEventService {
  constructor(
    @Inject('CheckUpdateOrderUsecaseInterface')
    private checkUpdateOrderUsecase: CheckUpdateOrderUsecaseInterface,
    private logger: Logger
  ) {}

  // Once a day
  @Cron('0 0 * * *')
  async checkUpdateOrderWebhook() {
    const [usecaseResponse, error] =
      await this.checkUpdateOrderUsecase.checkUpdateOrder();
    if (error) {
      this.logger.log('ERROR ', error);
    }
    this.logger.log('Successfully executed ', usecaseResponse);
  }
}
