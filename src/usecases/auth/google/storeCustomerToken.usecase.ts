import {  Inject, Injectable } from '@nestjs/common';
import * as ClientOAuth2 from 'client-oauth2';

import { ReturnValueType } from '@Filters/customError';
import { CustomerSessionRepositoryInterface } from '@Repositories/teatisDB/customer/customerSession.repository';
import {  CreateCalendarEventInterface } from '../../utils/createCalendarEvent';
import { createGooglClientOptions } from '../../utils/googleProvider';
import { Url } from '@Domains/Url';

interface StoreCustomerTokenArgs {
  originalUrl:string;
  sessionId:string;
}

export interface StoreCustomerTokenUsecaseInterface {
  storeCustomerToken( { originalUrl, sessionId }:StoreCustomerTokenArgs): Promise<ReturnValueType<Url>>;
}

@Injectable()
export class StoreCustomerTokenUsecase
implements StoreCustomerTokenUsecaseInterface
{
  constructor(
    @Inject('CustomerSessionRepositoryInterface')
    private customerSessionRepository: CustomerSessionRepositoryInterface,
    @Inject('CreateCalendarEventInterface')
    private createCalendarEvent: CreateCalendarEventInterface,
  ) {}

  async storeCustomerToken( { originalUrl, sessionId }:StoreCustomerTokenArgs): Promise<ReturnValueType<Url>> {
    const client = new ClientOAuth2(createGooglClientOptions());

    const [customerSession, getCustomerBySessionId] =
    await this.customerSessionRepository.getCustomerByCustomerSession({ sessionId });
    if(getCustomerBySessionId){
      return [undefined, getCustomerBySessionId];
    }
    const { email, id, uuid } = customerSession;
    const token = await client.code.getToken(originalUrl);
    await this.createCalendarEvent.createCalendarEvent({ customer: { email, id, uuid }, token });

    return [{ url: '/teatis-meal-box/thank-you' }];
  }
}
