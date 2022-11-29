import {  Inject, Injectable } from '@nestjs/common';
import * as ClientOAuth2 from 'client-oauth2';

import { ReturnValueType } from '@Filters/customError';
import {  CreateCalendarEventInterface } from '../../utils/createCalendarEvent';
import { Url } from '@Domains/Url';
import {  CustomerGeneralRepositoryInterface } from '../../../repositories/teatisDB/customer/customerGeneral.repository';
import { googleBaseOptions } from '../../utils/OAuthBaseOptions';

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
    const client:ClientOAuth2 = new ClientOAuth2({ ...googleBaseOptions, state: uuid });
    const [customerSession, getCustomerBySessionId] =
    await this.customerGeneralRepository.getCustomerByUuid({ uuid });
    if(getCustomerBySessionId){
      return [undefined, getCustomerBySessionId];
    }

    const { email, id } = customerSession;
    const token = await client.code.getToken(originalUrl);
    await this.createCalendarEvent.createCalendarEvent({ customer: { email, id, uuid }, token });

    return [{ url: '/teatis-meal-box/thank-you' }];
  }
}
