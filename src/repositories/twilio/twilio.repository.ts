/* eslint-disable no-console */
import { Inject, Injectable } from '@nestjs/common';
import { Twilio } from 'twilio';
import { ConversationInstance } from 'twilio/lib/rest/conversations/v1/conversation';
import { MessageInstance as ConversationMessageInstance } from 'twilio/lib/rest/conversations/v1/conversation/message';
import { MessageInstance as AccountMessageInstance } from 'twilio/lib/rest/api/v2010/account/message';
import { ParticipantInstance } from 'twilio/lib/rest/conversations/v1/conversation/participant';
import {  TwilioConversationBody } from '../../domains/TwilioChannel';
import { ReturnValueType } from '../../filter/customError';

interface CreateChannelArgs {
    channelName:string;
}

interface AddParticipantsArgs {
    channelSid:string;
    toPhone:string;
    fromPhone:string;
}

interface sendTextMessageArgs {
    customerChannelId:string;
    author:string;
    body:string;
}

interface sendMediaArgs {
    customerPhone:string;
    coachPhone:string;
    mediaUrls:string | string[];
}

interface CreateConversationOnFrontlineArgs {
    coachEmail:string;
    channelSid:string;
}

export interface TwilioRepositoryInterface {
  createChannel({ channelName }: CreateChannelArgs): Promise<ReturnValueType<ConversationInstance>>;
  sendTextMessage({ customerChannelId, author, body }:sendTextMessageArgs):
  Promise<ReturnValueType<ConversationMessageInstance>>;
  sendMedia({ customerPhone, coachPhone, mediaUrls }:sendMediaArgs):
  Promise<ReturnValueType<TwilioConversationBody>>;

  createConversationOnFrontline({ coachEmail, channelSid }:CreateConversationOnFrontlineArgs)
  :Promise<ParticipantInstance>;

  addParticipant({ channelSid, toPhone, fromPhone }: AddParticipantsArgs):
  Promise<ReturnValueType<ParticipantInstance>>;

  getConversationHistory({ customerChannelId }: { customerChannelId:string })
  :Promise<ReturnValueType<unknown[]>>;
  getInboundConversations(): Promise<ReturnValueType<AccountMessageInstance[]>>;
}

@Injectable()
export class TwilioRepository implements TwilioRepositoryInterface {
  constructor(@Inject('TwilioClient')
    private readonly twilioClient: Twilio,
  ) {}
  async createConversationOnFrontline({ coachEmail, channelSid }: CreateConversationOnFrontlineArgs):
  Promise<ParticipantInstance> {
    return await this.twilioClient.conversations.v1.conversations(channelSid)
      .participants
      .create({ identity: coachEmail } );
  }

  async sendMedia({ customerPhone, coachPhone, mediaUrls }: sendMediaArgs):
  Promise<ReturnValueType<TwilioConversationBody>> {
    try{
      const response = await this.twilioClient.api.messages
        .create({
          to: customerPhone,
          from: coachPhone,
          mediaUrl: mediaUrls,
        });

      return [{ messageSid: response.sid, body: response.body }];
    }catch(e){

      // Error code ref: https://www.twilio.com/docs/api/errors
      // Error code 21610 happens when attempting to send to unsubscribed customers
      return [undefined, new Error(e)];
    }
  }

  async createChannel({ channelName }: CreateChannelArgs):
  Promise<ReturnValueType<ConversationInstance>> {
    try{
      const response :ConversationInstance= await this.twilioClient.conversations.v1.conversations
        .create({ friendlyName: channelName });

      return [response];
    }catch(e){
      console.log('e: ', e);
      return [undefined, { name: e.code, message: 'Something went wrong. More info: ' + e.moreInfo }];
    }
  }

  async addParticipant({ channelSid, toPhone, fromPhone }: AddParticipantsArgs):
  Promise<ReturnValueType<ParticipantInstance>> {
    try{
      const response:ParticipantInstance =  await this.twilioClient.conversations.v1.conversations(channelSid)
        .participants
        .create({  messagingBinding: { address: toPhone, proxyAddress: fromPhone } } );

      return [response];
    }catch(e){
      console.log(e);
      if(e.code === 50407){
        return [undefined, { name: 'Invalid phone number', message: 'Customer phone number is invalid' }];
      }
      return [undefined, { name: e.code, message: `Something went wrong. More info:  + ${e.moreInfo}` }];

    }
  }

  async sendTextMessage({ customerChannelId, author, body }:sendTextMessageArgs):
  Promise<ReturnValueType<ConversationMessageInstance>>{
    console.log({ body });
    const response = await this.twilioClient.conversations.v1.conversations(customerChannelId)
      .messages
      .create({ author, body });
    return [response];
  }

  async getConversationHistory({ customerChannelId }: { customerChannelId:string }) :
  Promise<ReturnValueType<unknown[]>>{
    const serviceSid = process.env.TWILIO_SERVICE_SID;

    const storeData = [];
    await this.twilioClient.chat.v2
      .services(serviceSid)
      .channels(customerChannelId)
      .messages.list()
      .then((res) => {
        const data = [];
        for (const d of res) {
          data.push({
            sentAt: d.dateCreated,
            from: d.from,
            body: d.body,
          });
        }
        storeData.push(data);
      })
      .catch((e) => console.log(e));
    return storeData[0];
  }

  async getInboundConversations(): Promise<ReturnValueType<AccountMessageInstance[]>> {
    const now = new Date();
    const dateSentBefore = new Date(now.toLocaleString('en-US', { timeZone: 'America/Los_Angeles' }));
    const dateSentAfter = new Date(dateSentBefore.getTime() - (24 * 60 * 60 * 1000 * 3)); // 24 hours in milliseconds// set the time to 8am UTC (which is midnight PST)
    const response = await this.twilioClient.messages
      .list({
        dateSentAfter,
        dateSentBefore,
      })
      .then(messages => messages.filter(m => m.direction === 'inbound'));
    return [response];
  }
}
