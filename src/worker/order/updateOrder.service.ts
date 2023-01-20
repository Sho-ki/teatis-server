import {  Inject, Injectable, Logger } from '@nestjs/common';
import { UpdateCustomerOrderUsecaseInterface } from '../../usecases/customerOrder/updateCustomerOrder.usecase';

@Injectable()
export class UpdateOrderService {
  constructor(
    @Inject('UpdateCustomerOrderUsecaseInterface')
    private updateCustomerOrderUsecase: UpdateCustomerOrderUsecaseInterface,
    private logger: Logger
  ) {}

  async checkAndUpdateOrder() {
    const [usecaseResponse, error] =
      await this.updateCustomerOrderUsecase.updateCustomerOrder();
    if (error) {
      this.logger.log('ERROR ', error);
    }
    this.logger.log('Successfully executed ', usecaseResponse);
  }
}
