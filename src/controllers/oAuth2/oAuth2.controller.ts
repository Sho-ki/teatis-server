/* eslint-disable @typescript-eslint/no-explicit-any */
import { Controller, Get, Inject, Param, Query, Redirect, Req, Res, Session } from '@nestjs/common';
import { StoreCustomerTokenUsecaseInterface } from '@Usecases/auth/google/storeCustomerToken.usecase';
import { Request } from 'express';
import { CustomerAuthDto } from './dtos/customerAuthDto';
import { CheckHasValidTokenUsecaseInterface } from '@Usecases/auth/google/checkHasValidToken.usecase';
import { Response } from 'express';
import { GetCustomerBySessionIdUsecaseInterface } from '../../usecases/auth/google/getCustomerBySessionId.usecase';
import { GetOAuthUriUsecaseInterface } from '../../usecases/auth/google/getOAuthUri.usecase';

// export function createGooglClientOptions(uuid:string) : ClientOAuth2.Options {
//   return {
//     clientId: process.env.GOOGLE_CLIENT_ID,
//     clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//     accessTokenUri: 'https://oauth2.googleapis.com/token',
//     authorizationUri: `https://accounts.google.com/o/oauth2/v2/auth?access_type=offline&prompt=consent`,
//     redirectUri: `${process.env.SERVER_URL}/api/oauth2/callback/google`,
//     scopes: ['https://www.googleapis.com/auth/calendar', 'https://www.googleapis.com/auth/userinfo.profile', 'https://www.googleapis.com/auth/userinfo.email'],
//     state: `${uuid}`,
//   };
// }

// // class GoogleClientManager {
// //   const baseOptions: any;

// //   constructor() {
// //     baseOptions = {
// //       clientId: process.env.GOOGLE_CLIENT_ID,
// //       clientSecret: process.env.GOOGLE_CLIENT_SECRET,
// //       accessTokenUri: 'https://oauth2.googleapis.com/token',
// //       authorizationUri: `https://accounts.google.com/o/oauth2/v2/auth?access_type=offline&prompt=consent`,
// //       redirectUri: `${process.env.SERVER_URL}/api/oauth2/callback/google`,
// //       scopes: ['https://www.googleapis.com/auth/calendar', 'https://www.googleapis.com/auth/userinfo.profile', 'https://www.googleapis.com/auth/userinfo.email'],
// //     };
// //   }

// //   const getUri(uuid: string): string {
// //     const client = new ClientOAuth2({
// //       ...this.baseOptions,
// //       state: `${uuid}`,
// //     });
// //     return client.code.getUri();
// //   }

// // }

@Controller('api/oauth2')
export class OAuth2Controller {
  constructor(
    @Inject('StoreCustomerTokenUsecaseInterface')
    private storeCustomerTokenUsecase: StoreCustomerTokenUsecaseInterface,
    @Inject('CheckHasValidTokenUsecaseInterface')
    private checkHasValidTokenUsecase: CheckHasValidTokenUsecaseInterface,
    @Inject('GetCustomerBySessionIdUsecaseInterface')
    private getCustomerBySessionIdUsecase: GetCustomerBySessionIdUsecaseInterface,
    @Inject('GetOAuthUriUsecaseInterface')
    private getOAuthUriUsecase: GetOAuthUriUsecaseInterface,

  ) {}

  // api/oauth2/google
  @Get('auth/:provider')
  @Redirect()
  async getAuthUrl(@Param('provider') name: 'google', @Session() session: Record<string, any>,) {
    const sessionId = session['sessionId'];
    const [usecaseResponse, error] = await this.getCustomerBySessionIdUsecase.getCustomerBySessionId({ sessionId });
    if(error){
      return [undefined, error];
    }
    if(name === 'google'){
      const [response] = this.getOAuthUriUsecase.getUri({ uuid: usecaseResponse.uuid });
      return { url: response.url };
    } }

  @Get('callback/:provider')
  @Redirect()
  async oAuth2Callback(
    @Req() req:Request,
    @Param('provider') name: 'google',
    @Query('state') state:string
  ) {
    if(!state) return { url: 'https://app.teatismeal.com' };
    if(name === 'google'){
      const[usecaseResponse, error] =
      await this.storeCustomerTokenUsecase.storeCustomerToken(
        { originalUrl: req.originalUrl, uuid: state } );
      if(error){
        return { url: 'https://app.teatismeal.com' };
      }
      const domain  = process.env.ENV === 'local'? 'http://localhost:3000':'https://app.teatismeal.com';
      return { url: domain + usecaseResponse.url };
    }
  }

  @Get('me/:provider')
  // @Serialize(CustomerAuthDto)
  async oAuth2Me(
    @Session() session: Record<string, any>,
    @Res() response:Response<CustomerAuthDto | Error>,
    @Param('provider') name: 'google',
  ) {
    if(name === 'google'){
      const[usecaseResponse, error] =
      await this.checkHasValidTokenUsecase.checkHasValidToken( { sessionId: session['sessionId'] } );
      if(error){
        return [undefined, error];
      }
      const { id, isAuthenticated, email, uuid } = usecaseResponse;
      return response.status(200).send({ id, isAuthenticated, email, uuid } as CustomerAuthDto);
    }
  }
}
