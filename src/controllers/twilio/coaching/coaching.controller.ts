import { Body, Controller,  Inject, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import { GetCoachedCustomersUsecaseInterface } from '@Usecases/coaching/getCoachedCustomers.usecase';
import { GetCoachedCustomersDto } from './dto/getCustomerList.dto';
import { TwilioCustomerList } from '@Domains/TwilioCustomerList';
import { GetCustomerDetailUsecaseInterface } from '@Usecases/coaching/getCustomerDetail.usecase';
import { TwilioCustomerDetail } from '@Domains/TwilioCustomerDetail';

@Controller('api/twilio/coaching')
export class CoachingController {
  constructor(
    @Inject('GetCoachedCustomersUsecaseInterface')
    private getCoachedCustomersUsecase: GetCoachedCustomersUsecaseInterface,
    @Inject('GetCustomerDetailUsecaseInterface')
    private getCustomerDetailUsecase: GetCustomerDetailUsecaseInterface,

  ) {}

  // api/twilio/coaching/customers
  @Post('customers')
  async getCustomers(
    @Body() body: GetCoachedCustomersDto,
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
        const pageToken = body.Anchor? Number(body.Anchor):undefined;
        const [usecaseResponse, error] =
      await this.getCoachedCustomersUsecase.getCoachedCustomers(Worker, pageToken);
        if (error) {
          return response.status(500).send(error);
        }
        return response.status(200).send(usecaseResponse);
      }
    }

  }
}
