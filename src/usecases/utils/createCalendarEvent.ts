import { CustomerCalendarEvent } from '../../domains/CustomerCalendarEvent';
import { Inject, Injectable } from '@nestjs/common';

import { ShipheroRepositoryInterface } from '@Repositories/shiphero/shiphero.repository';
import { CustomerAuthRepositoryInterface } from '../../repositories/teatisDB/customer/customerAuth.repository';
import { GoogleCalendarRepositoryInterface } from '../../repositories/googleOAuth2/googleCalendar.repository';
import { ReturnValueType } from '../../filter/customError';
import ClientOAuth2 from 'client-oauth2';
import { Status } from '../../domains/Status';
import { CustomerEventLogRepositoryInterface } from '../../repositories/teatisDB/customerEventLog/customerEventLog.repository';

interface CreateCalendarEventArgs{
    customerId: number;
    uuid: string;
    email: string;
    token: ClientOAuth2.Token;
}
export interface CreateCalendarEventInterface {
  createCalendarEvent({
    customerId,
    uuid,
    email,
    token,
  }: CreateCalendarEventArgs): Promise<
    ReturnValueType<Status>>;
}

@Injectable()
export class CreateCalendarEvent implements CreateCalendarEventInterface {
  constructor(
    @Inject('CustomerAuthRepositoryInterface')
    private customerAuthRepository: CustomerAuthRepositoryInterface,
    @Inject('GoogleCalendarRepositoryInterface')
    private googleCalendarRepository: GoogleCalendarRepositoryInterface,
    @Inject('ShipheroRepositoryInterface')
    private shipheroRepository: ShipheroRepositoryInterface,
    @Inject('CustomerEventLogRepositoryInterface')
    private customerEventLogRepository: CustomerEventLogRepositoryInterface,

  ) {}

  private createEvent(
    { start, end, summary, recurrence, reminders, description, colorId }:CustomerCalendarEvent

  ): CustomerCalendarEvent {
    const event:CustomerCalendarEvent =
  {
    summary,
    end: { date: end.date },
    start: { date: start.date },
    recurrence,
    reminders: {
      overrides: reminders.overrides.map(({ method, minutes }) => { return { method, minutes }; }),
      useDefault: reminders.useDefault,
    },
    description,
    colorId,

  };
    return event;
  }

  async createCalendarEvent({  customerId, uuid, email, token }: CreateCalendarEventArgs):
  Promise<ReturnValueType<Status>>{
    // Refresh the current users access token.
    try{
      const updatedUser = await token.refresh();
      const [customerLastOrder] =
            await this.shipheroRepository.getLastCustomerOrder({ email, uuid });

      const calendarDate =  customerLastOrder.orderDate? new Date(customerLastOrder.orderDate): new Date();
      calendarDate.setDate(calendarDate.getDate() + 20);

      const tokenExpiredAt = new Date();
      tokenExpiredAt.setFullYear(tokenExpiredAt.getFullYear() + 20);
      updatedUser.expiresIn(tokenExpiredAt);
      const { accessToken, refreshToken } = updatedUser;

      const event = this.createEvent({
        summary: 'Time to Customize Your Snacks!',
        end: { date: new Date(calendarDate).toISOString().split('T')[0] },
        start: { date: new Date(calendarDate).toISOString().split('T')[0] },
        recurrence: ['RRULE:FREQ=DAILY;INTERVAL=5;COUNT=2'],
        reminders: {
          overrides: [
            {
              method: 'popup',
              minutes: 240,
            },
            {
              method: 'popup',
              minutes: 960,
            },
          ],
          useDefault: false,
        },
        description: `Evaluate your box in this month and customize your next box in the link below: https://app.teatismeal.com/teatis-meal-box/post-purchase?uuid=${uuid}`,
        colorId: '4',
      });

      await Promise.all([
        this.googleCalendarRepository.createCalendarEvent(
          { accessToken, event }
        ),
        this.customerAuthRepository.upsertCustomerAuthToken({
          customerId,
          provider: 'google',
          accessToken,
          tokenType: 'bearer',
          refreshToken,
          tokenExpiredAt,
        }),
        this.customerEventLogRepository.createCustomerEventLog({ customerId, event: 'postPurchaseCalendarCreated', date: new Date() }),
      ]);

    }catch(e){
      if(e.code === 'EAUTH'){
        return [undefined, { name: 'createCalendarEvent failed', message: 'refresh token is invalid, expired, revoked, does not match the redirection URI used in the authorization request, or was issued to another client.' }];
      }
      throw e;
    }

    return [{ success: true }];
  }
}
