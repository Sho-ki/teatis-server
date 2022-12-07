import { Body, Controller,  Inject, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import { GetCoachCustomersUsecaseInterface } from '@Usecases/coaching/getCoachCustomers.usecase';
import { GetCoachCustomersDto } from './dto/getCustomerList.dto';
import { TwilioCustomerList } from '@Domains/TwilioCustomerList';
import { GetCustomerDetailUsecaseInterface } from '@Usecases/coaching/getCustomerDetail.usecase';
import { TwilioCustomerDetail } from '@Domains/TwilioCustomerDetail';

@Controller('api/twilio/coaching')
export class CoachingController {
  constructor(
    @Inject('GetCoachCustomersUsecaseInterface')
    private getCoachCustomersUsecase: GetCoachCustomersUsecaseInterface,
    @Inject('GetCustomerDetailUsecaseInterface')
    private getCustomerDetailUsecase: GetCustomerDetailUsecaseInterface,

  ) {}

  // api/twilio/coaching/customers
  @Post('customers')
  async getCustomers(
    @Body() body: GetCoachCustomersDto,
    @Res() response: Response<TwilioCustomerList | TwilioCustomerDetail | Error>,
  ) {
    const { Location, Worker } = body;
    switch(Location){
      case 'GetCustomerDetailsByCustomerId':{
        const [usecaseResponse, error] =
      await this.getCustomerDetailUsecase.getCustomerDetail(Number(body.CustomerId));
        if (error) {
          return response.status(500).send(error);
        }
        return response.status(200).send(usecaseResponse);
      }
      case 'GetCustomersList':{
        const [usecaseResponse, error] =
      await this.getCoachCustomersUsecase.getCoachCustomers(Worker);
        if (error) {
          return response.status(500).send(error);
        }
        return response.status(200).send(usecaseResponse);
      }
    }

  }
}
