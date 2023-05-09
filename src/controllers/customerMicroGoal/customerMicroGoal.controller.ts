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
import { SetCustomerMicroGoalsRequestDto } from './dtos/request/setCustomerMicroGoals.dto';
import { SetCustomerMicroGoalsResponseDto } from './dtos/response/setCustomerMicroGoals.dto';
import { Serialize } from '../../interceptors/serialize.interceptor';
import { GetCustomerMicroGoalsRequestDto } from './dtos/request/getCustomerMicroGoals.dto';
import { GetCustomerMicroGoalsUsecaseInterface } from '../../usecases/customerMicroGoal/getCustomerMicroGoals.usecase';
import { GetCustomerMicroGoalsResponseDto } from './dtos/response/getCustomerMicroGoals.dto';
import { LogCustomerActionStepRequestDto } from './dtos/request/logCustomerActionStep.dto';
import { LogCustomerActionStepUsecaseInterface } from '../../usecases/customerActionStep/logCustomerActionStep.usecase';
import { LogCustomerActionStepResponseDto } from './dtos/response/logCustomerActionStep.dto';

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
  @Serialize(SetCustomerMicroGoalsResponseDto)
  async setCustomerMicroGoals(@Body() body: SetCustomerMicroGoalsRequestDto) {
    const [usecaseResponse, error] =
      await this.setCustomerMicroGoalsUsecase.execute(body);
    if (error) {
      throw new HttpException(error, HttpStatus.CONFLICT);
    }
    return usecaseResponse;
  }

  @Get()
  @Serialize(GetCustomerMicroGoalsResponseDto.Main)
  async getCustomerMicroGoals(@Query() query: GetCustomerMicroGoalsRequestDto) {
    const [usecaseResponse, error] =
      await this.getCustomerMicroGoalsUsecase.execute(query);
    if (error) {
      throw new HttpException(error, HttpStatus.CONFLICT);
    }
    return usecaseResponse;
  }

  @Post('action-step')
  @Serialize(LogCustomerActionStepResponseDto.Main)
  async logCustomerActionStep(@Body() body: LogCustomerActionStepRequestDto) {
    const [usecaseResponse, error] =
      await this.logCustomerActionStepUsecase.execute(body);
    if (error) {
      throw new HttpException(error, HttpStatus.NOT_FOUND);
    }
    return usecaseResponse;
  }
}
