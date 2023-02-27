import {  Inject, Injectable } from '@nestjs/common';
import { CreateEmployeeOrderUsecaseInterface } from '../../usecases/employeeOrder/createEmployeeOrder.usecase';

@Injectable()
export class CreateEmployeeOrderService {
  constructor(
    @Inject('CreateEmployeeOrderUsecaseInterface')
    private createEmployeeOrderUsecase: CreateEmployeeOrderUsecaseInterface
  ) {}

  async createEmployeeOrder() {
    await this.createEmployeeOrderUsecase.createEmployeeOrder();
  }
}
