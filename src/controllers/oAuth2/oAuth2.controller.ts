/* eslint-disable @typescript-eslint/no-explicit-any */
import { Controller, Get, Inject, Param, Redirect, Req, Res, Session } from '@nestjs/common';
import { StoreCustomerTokenUsecaseInterface } from '@Usecases/auth/google/storeCustomerToken.usecase';
import * as ClientOAuth2 from 'client-oauth2';
import { createGooglClientOptions } from '@Usecases/utils/googleProvider';
import { Request } from 'express';
import { CustomerAuthDto } from './dtos/customerAuthDto';
import { CheckHasValidTokenUsecaseInterface } from '@Usecases/auth/google/checkHasValidToken.usecase';
import { Response } from 'express';

@Controller('api/oauth2')
export class OAuth2Controller {
  private client: ClientOAuth2;
  constructor(
    @Inject('StoreCustomerTokenUsecaseInterface')
    private storeCustomerTokenUsecase: StoreCustomerTokenUsecaseInterface,
    @Inject('CheckHasValidTokenUsecaseInterface')
    private checkHasValidTokenUsecase: CheckHasValidTokenUsecaseInterface,

  ) {}

  @Get('auth/:provider')
  @Redirect()
  async getAuthUrl(@Param('provider') name: 'google') {
    if(name === 'google'){
      this.client = new ClientOAuth2(createGooglClientOptions());
      const url = this.client.code.getUri();
      return { url };
    } }

  @Get('callback/:provider')
  @Redirect()
  async oAuth2Callback(
    @Session() session: Record<string, any>,
    @Req() req:Request,
    @Param('provider') name: 'google',
  ) {
    if(name === 'google'){
      const[usecaseResponse, error] =
      await this.storeCustomerTokenUsecase.storeCustomerToken( { originalUrl: req.originalUrl, sessionId: session['sessionId'] } );
      if(error){
        return {};
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
