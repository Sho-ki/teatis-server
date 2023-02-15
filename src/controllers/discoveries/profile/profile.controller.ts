import { Body, Controller, Inject, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import { PostPrePurchaseSurveyUsecaseInterface } from '@Usecases/prePurchaseSurvey/postPrePurchaseSurvey.usecase';
import { Customer } from '@Domains/Customer';
import { PostCustomerProfileDto } from './dtos/postCustomerProfile.dto';

@Controller('api/discovery')
export class PrePurchaseSurveyController {
  constructor(
    @Inject('PostPrePurchaseSurveyUsecaseInterface')
    private postPrePurchaseSurveyUsecase: PostPrePurchaseSurveyUsecaseInterface,
  ) {}
  // POST: api/discovery/profile
  @Post('profile')
  async postCustomerProfile(
    @Body() body: PostCustomerProfileDto,
    @Res() response: Response<Customer | Error>,
  ) {
    const [usecaseResponse, error] =
      await this.postPrePurchaseSurveyUsecase.postPrePurchaseSurvey(body);
    if (error) {
      return response.status(500).send(error);
    }

    return response.status(201).send(usecaseResponse);
  }
}
