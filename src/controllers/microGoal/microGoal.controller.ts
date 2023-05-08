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
import { SetCustomerMicroGoalsUsecaseInterface } from '../../usecases/microGoal/setCustomerMicroGoals.usecase';
import { SetCustomerMicroGoalsRequestDto } from './dtos/request/setCustomerMicroGoals.dto';
import { SetCustomerMicroGoalsResponseDto } from './dtos/response/setCustomerMicroGoals.dto';
import { Serialize } from '../../interceptors/serialize.interceptor';
import { GetCustomerMicroGoalsResponseDto } from './dtos/response/getCustomerMicroGoals.dto';
import { GetCustomerMicroGoalsRequestDto } from './dtos/request/getCustomerMicroGoals.dto';
import { GetCustomerMicroGoalsUsecaseInterface } from '../../usecases/microGoal/getCustomerMicroGoals.usecase';

@Controller('api/micro-goals')
export class MicroGoalController {
  constructor(
    @Inject('SetCustomerMicroGoalsUsecaseInterface')
    private setCustomerMicroGoalsUsecase: SetCustomerMicroGoalsUsecaseInterface,
    @Inject('GetCustomerMicroGoalsUsecaseInterface')
    private getCustomerMicroGoalsUsecase: GetCustomerMicroGoalsUsecaseInterface,
  ) {}

  @Post('customer-micro-goals')
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

  @Get('customer-micro-goals')
  @Serialize(GetCustomerMicroGoalsResponseDto)
  async getCustomerMicroGoals(@Query() query: GetCustomerMicroGoalsRequestDto) {
    const [usecaseResponse, error] =
      await this.getCustomerMicroGoalsUsecase.execute(query);
    if (error) {
      throw new HttpException(error, HttpStatus.CONFLICT);
    }
    return usecaseResponse;
  }
}
