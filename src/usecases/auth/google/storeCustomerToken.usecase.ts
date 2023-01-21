import {  Inject, Injectable } from '@nestjs/common';
import * as ClientOAuth2 from 'client-oauth2';

import { ReturnValueType } from '@Filters/customError';
import {  CreateCalendarEventInterface } from '@Usecases/utils/createCalendarEvent';
import { Url } from '@Domains/Url';
import {  CustomerGeneralRepositoryInterface } from '@Repositories/teatisDB/customer/customerGeneral.repository';
import { createGoogleOAuthClient } from '@Usecases/utils/OAuthClient';

interface StoreCustomerTokenArgs {
  originalUrl:string;
  uuid:string;
}

export interface StoreCustomerTokenUsecaseInterface {
  storeCustomerToken( { originalUrl, uuid }:StoreCustomerTokenArgs): Promise<ReturnValueType<Url>>;
}

@Injectable()
export class StoreCustomerTokenUsecase
implements StoreCustomerTokenUsecaseInterface
{

  constructor(
    @Inject('CustomerGeneralRepositoryInterface')
    private customerGeneralRepository: CustomerGeneralRepositoryInterface,
    @Inject('CreateCalendarEventInterface')
    private createCalendarEvent: CreateCalendarEventInterface,
  ) {}

  async storeCustomerToken( { originalUrl, uuid }:StoreCustomerTokenArgs): Promise<ReturnValueType<Url>> {
    const client:ClientOAuth2 = createGoogleOAuthClient(uuid);
    const [customerSession, getCustomerBySessionId] =
    await this.customerGeneralRepository.getCustomerByUuid({ uuid });
    if(getCustomerBySessionId){
      return [undefined, getCustomerBySessionId];
    }

    const { email, id } = customerSession;
    const token = await client.code.getToken(originalUrl);
    await this.createCalendarEvent.createCalendarEvent({  email, customerId: id, uuid, token });

    return [{ url: '/teatis-meal-box/thank-you' }];
  }
}
