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

  // Every 3 hours
  @Cron('0 */3 * * *')
  async checkUpdateOrderWebhook() {
    const [usecaseResponse, error] =
      await this.checkUpdateOrderUsecase.checkUpdateOrder();
    if (error) {
      this.logger.log('ERROR ', error);
    }
    this.logger.log('Successfully executed ', usecaseResponse);
  }
}
