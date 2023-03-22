import {  Inject, Injectable } from '@nestjs/common';
import { CreateRewardOrderUsecaseInterface } from '../../usecases/rewardOrder/createRewardOrder.usecase';

@Injectable()
export class CreateRewardOrderService {
  constructor(
    @Inject('CreateRewardOrderUsecaseInterface')
    private createRewardOrderUsecase: CreateRewardOrderUsecaseInterface
  ) {}

  async createRewardOrder() {
    await this.createRewardOrderUsecase.createRewardOrder();
  }
}
