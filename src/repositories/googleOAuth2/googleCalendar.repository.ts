import { Injectable } from '@nestjs/common';
import { ReturnValueType } from '@Filters/customError';
import axios from 'axios';
import { CreateCalendarEventResponse } from './googleCalendar.interface';
import { CustomerCalendarEvent } from '@Domains/CustomerCalendarEvent';

export interface CreateCalendarEventArgs {
  accessToken: string;
  event: CustomerCalendarEvent;
}

export interface GoogleCalendarRepositoryInterface {
  createCalendarEvent({ accessToken, event }: CreateCalendarEventArgs): Promise<ReturnValueType<CustomerCalendarEvent>>;
}

@Injectable()
export class GoogleCalendarRepository implements GoogleCalendarRepositoryInterface {

  async createCalendarEvent({ accessToken, event }: CreateCalendarEventArgs):
  Promise<ReturnValueType<CustomerCalendarEvent>>{
    const apiKey = process.env.GCP_API_KEY;
    const response = await axios.post<CreateCalendarEventResponse.RootObject>(
      `https://www.googleapis.com/calendar/v3/calendars/primary/events?key=${apiKey}`,
      event,
      { headers: { Authorization: `Bearer ${accessToken}` } } );
    if (response.status !== 200) return [undefined, { name: 'createCalendarEvent', message: 'createCalendarEvent failed' }];

    return [event];
  }
}
