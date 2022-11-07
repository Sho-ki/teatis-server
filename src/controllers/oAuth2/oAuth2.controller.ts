/* eslint-disable @typescript-eslint/no-explicit-any */
import { Controller, Get, Inject, Param, Query, Redirect, Req, Res, Session } from '@nestjs/common';
import { StoreCustomerTokenUsecaseInterface } from '@Usecases/auth/google/storeCustomerToken.usecase';
import * as ClientOAuth2 from 'client-oauth2';
import { createGooglClientOptions } from '@Usecases/utils/googleProvider';
import { Request } from 'express';
import { CustomerAuthDto } from './dtos/customerAuthDto';
import { CheckHasValidTokenUsecaseInterface } from '@Usecases/auth/google/checkHasValidToken.usecase';
import { Response } from 'express';
import { GetCustomerBySessionIdUsecaseInterface } from '../../usecases/auth/google/getCustomerBySessionId.usecase';

@Controller('api/oauth2')
export class OAuth2Controller {
  private client: ClientOAuth2;
  constructor(
    @Inject('StoreCustomerTokenUsecaseInterface')
    private storeCustomerTokenUsecase: StoreCustomerTokenUsecaseInterface,
    @Inject('CheckHasValidTokenUsecaseInterface')
    private checkHasValidTokenUsecase: CheckHasValidTokenUsecaseInterface,
    @Inject('GetCustomerBySessionIdUsecaseInterface')
    private getCustomerBySessionIdUsecase: GetCustomerBySessionIdUsecaseInterface,

  ) {}

  @Get('auth/:provider')
  @Redirect()
  async getAuthUrl(@Param('provider') name: 'google', @Session() session: Record<string, any>,) {
    const sessionId = session['sessionId'];
    const [usecaseResponse, error] = await this.getCustomerBySessionIdUsecase.getCustomerBySessionId({ sessionId });
    if(error){
      return [undefined, error];
    }
    if(name === 'google'){
      this.client = new ClientOAuth2(createGooglClientOptions(usecaseResponse.uuid));
      const url = this.client.code.getUri();
      return { url };
    } }

  @Get('callback/:provider')
  @Redirect()
  async oAuth2Callback(
    @Req() req:Request,
    @Param('provider') name: 'google',
    @Query('state') state:string
  ) {
    if(name === 'google'){
      const[usecaseResponse, error] =
      await this.storeCustomerTokenUsecase.storeCustomerToken(
        { originalUrl: req.originalUrl, client: this.client, uuid: state } );
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
