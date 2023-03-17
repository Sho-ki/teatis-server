import {  Controller,  Inject,  Post, Req, Res } from '@nestjs/common';
import { Customer } from '../../../domains/Customer';
import { Response, Request } from 'express';
import twilio from 'twilio';
import { OnMessageAddedUsecaseInterface } from '../../../usecases/twilio/onMessageAdded.usecase';
import { TwilioEvent } from '../../../domains/twilioEvent';

@Controller('api/twilio')
export class TwilioWebhookController {
  constructor(
    @Inject('OnMessageAddedUsecaseInterface')
    private readonly onMessageAddedUsecase:OnMessageAddedUsecaseInterface
  ) {}
  private isValidTwilioRequest(request: Request): boolean {
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const signature = request.headers['x-twilio-signature'] as string;
    const url = `https://${request.hostname}${request.url}`;
    const params = request.body;

    return twilio.validateRequest(authToken, signature, url, params);
  }

  // Post: api/twilio/post-event-webhook
  @Post('post-event-webhook')
  async postEventWebhook(
    @Req() request: Request,
    @Res() response: Response<Customer | Error>,
  ) {

    if (!this.isValidTwilioRequest(request)) return response.status(401).send({ name: 'Unauthorized', message: 'Unauthorized' });

    const requestBody:TwilioEvent = request.body;

    const noCountAuthorList = ['AUTO MESSAGE', 'coach@teatismeal.com'];

    if(noCountAuthorList.includes(requestBody.Author))return response.status(200).send({ name: 'NoCount', message: 'NoCount' });

    const message = requestBody.Body.replace(/\s+/g, '').toLowerCase();
    const noCountWordList = [
      'stop',
      'start',
      'no',
      'n',
    ];
    const noCountIncludesList = ['cancel', 'unsubscribe'];

    const noCountWordFound = noCountWordList.find((word) => message === word);
    const noIncludesWordFound = noCountIncludesList.some((word) => message.includes(word));

    if (noCountWordFound || noIncludesWordFound)return response.status(200).send({ name: 'NoCount', message: 'NoCount' });

    switch (requestBody.EventType) {
      case 'onMessageAdded': {
        const [usecase] = await this.onMessageAddedUsecase.onMessageAdded(requestBody);
        return response.status(201).send(usecase);
      }
    }

  }

}
