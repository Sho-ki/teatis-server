// import { Controller, Inject, Query, Get, Post, Body, Res } from '@nestjs/common';
// import { GetTerraAuthUrlUsecaseInterface } from '../../usecases/terraAuth/getTerraAuthUrl.usecase';
// import { UpsertAllCustomersGlucoseUsecaseInterface } from '../../usecases/terraCustomerGlucose/upsertAllCustomersGlucose.usecase';
// import { PostTerraAuthSuccessUsecaseInterface } from '../../usecases/terraAuth/postTerraAuthSuccess.usecase';
// import { PostAuthSuccessDto } from './dtos/postAuthSuccessDto';
// import { Status } from '../../domains/Status';
// import { Response } from 'express';

// @Controller('api/twilio')
// export class TwilioController {
//   constructor(
//     @Inject('PostTerraAuthSuccessUsecaseInterface')
//     private postTerraAuthSuccessUsecaseInterface: PostTerraAuthSuccessUsecaseInterface,
//   ) {}
//   // Post: api/twilio/send-code
//   @Post('send-code')
//   async sendCode(@Body() body: PostAuthSuccessDto) {
//     const [, error] =
//       await this.postTerraAuthSuccessUsecaseInterface.postTerraAuthSuccess(body);
//     if (error) {
//       return { url: 'https://widget.tryterra.co/auth-failure' };
//     }
//     return { url: 'https://widget.tryterra.co/auth-success?resource=FREESTYLELIBRE' };
//   }

// }
