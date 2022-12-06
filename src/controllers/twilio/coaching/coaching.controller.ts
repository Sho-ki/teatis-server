import { Controller, Get, Inject, Query, Res } from '@nestjs/common';
import { Response } from 'express';
import { GetCoachCustomersUsecaseInterface } from '../../../usecases/coaching/getCoachCustomers.usecase';
import { GetCoachCustomersDto } from './dto/getCoachCustomers.dto';
import { TwilioCustomer } from '../../../domains/TwilioCustomer';

@Controller('api/twilio/coaching')
export class CoachingController {
  constructor(
    @Inject('GetCoachCustomersUsecaseInterface')
    private getCoachCustomersUsecase: GetCoachCustomersUsecaseInterface,
  ) {}

  //   api/twilio/coaching/customers
  @Get('customers')
  async getCustomers(
    @Query() body: GetCoachCustomersDto,
    @Res() response: Response<TwilioCustomer[] | Error>,
  ) {

    const [usecaseResponse, error] =
      await this.getCoachCustomersUsecase.getCoachCustomers(body.email);

    if (error) {
      return response.status(500).send(error);
    }
    return response.status(200).send(usecaseResponse);
  }
}
