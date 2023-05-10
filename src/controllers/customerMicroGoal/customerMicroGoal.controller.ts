import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Inject,
  Post,
  Query,
} from '@nestjs/common';
import { SetCustomerMicroGoalsUsecaseInterface } from '../../usecases/customerMicroGoal/setCustomerMicroGoals.usecase';
import { Serialize } from '../../interceptors/serialize.interceptor';
import { GetCustomerMicroGoalsRequestDto } from './dtos/getCustomerMicroGoals.dto';
import { GetCustomerMicroGoalsUsecaseInterface } from '../../usecases/customerMicroGoal/getCustomerMicroGoals.usecase';
import { LogCustomerActionStepUsecaseInterface } from '../../usecases/customerActionStep/logCustomerActionStep.usecase';
import { CustomerWithMicroGoalDto } from '../ResponseDtos/CustomerWithMicroGoal.dto';
import { CustomerDto } from '../ResponseDtos/Customer.dto';
import { ActionStepSummaryDto } from '../ResponseDtos/ActionStepSummary.dto';
import { SetCustomerMicroGoalsRequestDto } from './dtos/setCustomerMicroGoals.dto';
import { LogCustomerActionStepRequestDto } from './dtos/logCustomerActionStep.dto';

@Controller('api/customer-micro-goals')
export class CustomerMicroGoalController {
  constructor(
    @Inject('SetCustomerMicroGoalsUsecaseInterface')
    private setCustomerMicroGoalsUsecase: SetCustomerMicroGoalsUsecaseInterface,
    @Inject('GetCustomerMicroGoalsUsecaseInterface')
    private getCustomerMicroGoalsUsecase: GetCustomerMicroGoalsUsecaseInterface,
    @Inject('LogCustomerActionStepUsecaseInterface')
    private logCustomerActionStepUsecase: LogCustomerActionStepUsecaseInterface
  ) {}

  @Post()
  @HttpCode(201)
  @Serialize(CustomerDto)
  async setCustomerMicroGoals(@Body() body: SetCustomerMicroGoalsRequestDto) {
    const [usecaseResponse, error] =
      await this.setCustomerMicroGoalsUsecase.execute(body);
    if (error) {
      throw new HttpException(error, HttpStatus.CONFLICT);
    }
    return usecaseResponse;
  }

  @Get()
  @Serialize(CustomerWithMicroGoalDto)
  async getCustomerMicroGoals(@Query() query: GetCustomerMicroGoalsRequestDto) {
    const [usecaseResponse, error] =
      await this.getCustomerMicroGoalsUsecase.execute(query);
    if (error) {
      throw new HttpException(error, HttpStatus.NOT_FOUND);
    }
    return usecaseResponse;
  }

  @Post('action-step')
  @Serialize(ActionStepSummaryDto)
  async logCustomerActionStep(@Body() body: LogCustomerActionStepRequestDto) {
    const [usecaseResponse, error] =
      await this.logCustomerActionStepUsecase.execute(body);
    if (error) {
      throw new HttpException(error, HttpStatus.NOT_FOUND);
    }
    return usecaseResponse;
  }
}
