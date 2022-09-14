import { Controller, Inject, Query, Get, Post, Body, Res } from '@nestjs/common';
import { GetTerraAuthUrlUsecaseInterface } from '../../usecases/terraAuth/getTerraAuthUrl.usecase';
import { UpsertAllCustomersGlucoseUsecaseInterface } from '../../usecases/terraCustomerGlucose/upsertAllCustomersGlucose.usecase';
import { PostTerraAuthSuccessUsecaseInterface } from '../../usecases/terraAuth/postTerraAuthSuccess.usecase';
import { PostAuthSuccessDto } from './dtos/postAuthSuccessDto';
import { Status } from '../../domains/Status';
import { Response } from 'express';

@Controller('api/terra')
export class TerraController {
  constructor(
    @Inject('PostTerraAuthSuccessUsecaseInterface')
    private postTerraAuthSuccessUsecaseInterface: PostTerraAuthSuccessUsecaseInterface,
    @Inject('GetTerraAuthUrlUsecaseInterface')
    private getTerraAuthUrlUsecaseInterface: GetTerraAuthUrlUsecaseInterface,
    @Inject('UpsertAllCustomersGlucoseUsecaseInterface')
    private upsertAllCustomersGlucoseUsecase: UpsertAllCustomersGlucoseUsecaseInterface,

  ) {}
  // Post: api/terra/auth-success
  @Post('auth-success')
  async postTerraAuthSuccess(@Body() body: PostAuthSuccessDto) {
    const [, error] =
      await this.postTerraAuthSuccessUsecaseInterface.postTerraAuthSuccess(body);
    if (error) {
      return { url: 'https://widget.tryterra.co/auth-failure' };
    }
    return { url: 'https://widget.tryterra.co/auth-success?resource=FREESTYLELIBRE' };
  }

  // Get: api/terra/auth-url
  @Get('auth-url')
  async getTerraAuthUrl(@Query('uuid') uuid: string) {
    const [usecaseResponse, error] =
      await this.getTerraAuthUrlUsecaseInterface.getTerraAuthUrl(uuid);
    if (error) {
      return { url: 'https://teatismeal.com/pages/teatis-meal-box' };
    }
    return { url: usecaseResponse.url };
  }

  // Post: api/terra/customer-glucose
  @Post('customer-glucose')
  async postCustomerGlucose(@Res() response: Response<Status | Error>,) {
    const [usecaseResponse, error] = await this.upsertAllCustomersGlucoseUsecase.upsertAllCustomersGlucose();
    if(error){
      return response.status(500).send(error);
    }
    return response.status(201).send(usecaseResponse);
  }

}