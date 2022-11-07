import { CustomerCalendarEvent } from '../../domains/CustomerCalendarEvent';
import { Inject, Injectable } from '@nestjs/common';

import { ShipheroRepositoryInterface } from '@Repositories/shiphero/shiphero.repository';
import { CustomerAuthRepositoryInterface } from '../../repositories/teatisDB/customer/customerAuth.repository';
import { GoogleCalendarRepositoryInterface } from '../../repositories/googleOAuth2/googleCalendar.repository';
import { ReturnValueType } from '../../filter/customError';
import ClientOAuth2 from 'client-oauth2';
import { Customer } from '../../domains/Customer';
import { Status } from '../../domains/Status';

interface CreateCalendarEventArgs{
    customer : Customer;
    token: ClientOAuth2.Token;
}
export interface CreateCalendarEventInterface {
  createCalendarEvent({
    customer,
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

  async createCalendarEvent({ customer, token }: CreateCalendarEventArgs): Promise<ReturnValueType<Status>>{
    // Refresh the current users access token.
    await token.refresh().then(async(updatedUser) => {
      const [customerLastOrder, getCustomerLastOrder] =
            await this.shipheroRepository.getLastCustomerOrder({ email: customer.email });
      if(getCustomerLastOrder){
        return [undefined, getCustomerLastOrder];
      }
      const calendarDate =  customerLastOrder.orderDate? new Date(customerLastOrder.orderDate): new Date();
      calendarDate.setDate(calendarDate.getDate() + 20);

      const tokenExpiredAt = new Date();
      tokenExpiredAt.setFullYear(tokenExpiredAt.getFullYear() + 20);
      updatedUser.expiresIn(tokenExpiredAt);
      const { accessToken, refreshToken } = updatedUser;

      const [, upsertCustomerAuthError] =
          await this.customerAuthRepository.upsertCustomerAuthToken({
            customerId: customer.id,
            provider: 'google',
            accessToken,
            tokenType: 'bearer',
            refreshToken,
            tokenExpiredAt,
          });
      if(upsertCustomerAuthError){
        return [undefined, upsertCustomerAuthError];
      }

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
        description: `Evaluate your box in this month and customize your next box in the link below: https://app.teatismeal.com/teatis-meal-box/post-purchase?uuid=${customer.uuid}`,
        colorId: '4',
      });
      const [, createCalendarEventError] = await this.googleCalendarRepository.createCalendarEvent(
        { accessToken, event }
      );
      if(createCalendarEventError){
        return [undefined, createCalendarEventError];
      }
    });

    return [{ success: true }];
  }
}
