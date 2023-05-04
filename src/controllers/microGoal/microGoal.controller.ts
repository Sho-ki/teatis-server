import { Body, Controller, HttpCode, HttpException, HttpStatus, Inject, Post } from '@nestjs/common';
import { SetCustomerMicroGoalsUsecaseInterface } from '../../usecases/microGoal/setCustomerMicroGoals.usecase';
import { SetCustomerMicroGoalsRequestDto } from './dtos/request/setCustomerMicroGoals.dto';
import { SetCustomerMicroGoalsResponseDto } from './dtos/response/setCustomerMicroGoals.dto';
import { Serialize } from '../../interceptors/serialize.interceptor';

@Controller('api/micro-goals')
export class MicroGoalController {
  constructor(
    @Inject('SetCustomerMicroGoalsUsecaseInterface')
    private setCustomerMicroGoalsUsecase: SetCustomerMicroGoalsUsecaseInterface,
  ) {}

  @Post('customer-micro-goals')
  @HttpCode(201)
  @Serialize(SetCustomerMicroGoalsResponseDto)
  async setCustomerMicroGoals(
    @Body() body: SetCustomerMicroGoalsRequestDto,
  ) {
    const [usecaseResponse, error] =
      await this.setCustomerMicroGoalsUsecase.execute(body);
    if (error) {
      throw new HttpException(error, HttpStatus.CONFLICT);
    }
    return usecaseResponse;
  }
}
