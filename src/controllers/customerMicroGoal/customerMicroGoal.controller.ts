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
import { PostCustomerMicroGoalsUsecaseInterface } from '../../usecases/customerMicroGoal/postCustomerMicroGoals.usecase';
import { Serialize } from '../../interceptors/serialize.interceptor';
import { GetCustomerMicroGoalsRequestDto } from './dtos/getCustomerMicroGoals.dto';
import { GetCustomerMicroGoalsUsecaseInterface } from '../../usecases/customerMicroGoal/getCustomerMicroGoals.usecase';
import { PostCustomerActionStepUsecaseInterface } from '../../usecases/customerActionStep/postCustomerActionStep.usecase';
import { CustomerWithMicroGoalDto } from '../ResponseDtos/CustomerWithMicroGoal.dto';
import { CustomerDto } from '../ResponseDtos/Customer.dto';
import { PostCustomerMicroGoalsRequestDto } from './dtos/postCustomerMicroGoals.dto';
import { PostCustomerActionStepRequestDto } from './dtos/postCustomerActionStep.dto';
import { ActionStepDto } from '../ResponseDtos/ActionStep.dto';

@Controller('api/customer-micro-goals')
export class CustomerMicroGoalController {
  constructor(
    @Inject('PostCustomerMicroGoalsUsecaseInterface')
    private postCustomerMicroGoalsUsecase: PostCustomerMicroGoalsUsecaseInterface,
    @Inject('GetCustomerMicroGoalsUsecaseInterface')
    private getCustomerMicroGoalsUsecase: GetCustomerMicroGoalsUsecaseInterface,
    @Inject('PostCustomerActionStepUsecaseInterface')
    private postCustomerActionStepUsecase: PostCustomerActionStepUsecaseInterface
  ) {}

  @Post()
  @HttpCode(201)
  @Serialize(CustomerDto)
  async postCustomerMicroGoals(@Body() body: PostCustomerMicroGoalsRequestDto) {
    const [usecaseResponse, error] =
      await this.postCustomerMicroGoalsUsecase.execute(body);
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

  @Post('action-steps')
  @Serialize(ActionStepDto)
  async postCustomerActionStep(@Body() body: PostCustomerActionStepRequestDto) {
    const [usecaseResponse, error] =
      await this.postCustomerActionStepUsecase.execute(body);
    if (error) {
      throw new HttpException(error, HttpStatus.NOT_FOUND);
    }
    return usecaseResponse;
  }
}
