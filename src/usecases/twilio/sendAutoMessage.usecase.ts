/* eslint-disable no-console */
import {  Inject, Injectable } from '@nestjs/common';
import { ReturnValueType } from '@Filters/customError';

import { CoachRepositoryInterface } from '@Repositories/teatisDB/coach/coach.repository';
import { CoachedCustomer } from '@Domains/CoachedCustomer';
import { TwilioRepositoryInterface } from '../../repositories/twilio/twilio.repository';
import { CustomerGeneralRepositoryInterface } from '../../repositories/teatisDB/customer/customerGeneral.repository';
import { PurchaseDateBasedAutoMessage, SequenceBasedAutoMessage } from '../../domains/AutoMessage';
import { pstTime } from '../utils/dates';
import { BitlyRepositoryInterface } from '../../repositories/bitly/bitly.repository';
import { PurchaseDateBasedMessageRepositoryInterface } from '../../repositories/teatisDB/autoMessage/purchaseDateBasedMessage.repository';
import { SequentBasedMessageRepository } from '../../repositories/teatisDB/autoMessage/sequesntBasedMessage.repository';

export interface SendAutoMessageUsecaseInterface {
  sendAutoMessage():
  Promise<ReturnValueType<string>>;
}

type sendAt =
   'at0'| 'at3'| 'at6'| 'at9'| 'at12'| 'at15'| 'at18'| 'at21';

enum TwilioError {
  invalidPhoneNumber = 'Invalid phone number'
}
@Injectable()
export class SendAutoMessageUsecase
implements SendAutoMessageUsecaseInterface
{
  private sendMessageErrorStack = [];
  private getCustomerDataErrorStack=[];
  constructor(

  @Inject('PurchaseDateBasedMessageRepositoryInterface')
  private readonly purchaseDateBasedMessageRepository: PurchaseDateBasedMessageRepositoryInterface,
  @Inject('SequentBasedMessageRepository')
  private readonly sequentBasedMessageRepository: SequentBasedMessageRepository,
  @Inject('CoachRepositoryInterface')
  private readonly coachRepository: CoachRepositoryInterface,
  @Inject('TwilioRepositoryInterface')
  private readonly twilioRepository: TwilioRepositoryInterface,
  @Inject('CustomerGeneralRepositoryInterface')
  private readonly customerGeneralRepository: CustomerGeneralRepositoryInterface,
  @Inject('BitlyRepositoryInterface')
  private readonly bitlyRepository: BitlyRepositoryInterface,

  ) {}

  private async registerTwilioChannelSidToCustomer(customer:CoachedCustomer): Promise<string | undefined>{
    const channelName = `${customer.firstName} ${customer.lastName?customer.lastName:''} - ID:${customer.id}`;
    const [twilioChannel, createTwilioChannelError] = await this.twilioRepository.createChannel(
      { channelName });
    if(createTwilioChannelError) {
      this.sendMessageErrorStack.push(createTwilioChannelError);
      return undefined;
    }

    await this.twilioRepository.createConversationOnFrontline(
      { channelSid: twilioChannel.sid, coachEmail: customer.coach.email });

    const [, addParticipantsError] = await this.twilioRepository.addParticipant(
      { channelSid: twilioChannel.sid, toPhone: customer.phone, fromPhone: customer.coach.phone });

    if(addParticipantsError) {
      if(addParticipantsError.name === TwilioError.invalidPhoneNumber){
        // TODO: phone number invalid
      }
      return undefined;
    }

    await this.customerGeneralRepository.updateCustomerTwilioChannelSid(
      { customerId: customer.id, twilioChannelSid: twilioChannel.sid });

    return twilioChannel.sid;

  }

  private extractVariablesFromTemplate(template: string): string[] {
    const placeholderRegex = /\$\{ *([^}]+) *\}/g;
    const variables: string[] = [];
    let match: string[];
    while ((match = placeholderRegex.exec(template)) !== null) {
    // Trim spaces from the placeholder string
      const placeholder = match[1].trim();
      variables.push(placeholder);
    }
    return variables;
  }

  private replaceTemplateVariableWithValue(template:string, customer:CoachedCustomer):string{
    const variables:string[]= this.extractVariablesFromTemplate(template);

    const placeholderRegexes = {
      'customer.uuid': /\$\{ *customer\.uuid *\}/g,
      'customer.firstname': /\$\{ *customer\.firstname *\}/g,
    };

    let filledTemplate = template;
    if(variables.includes('customer.uuid')){
      filledTemplate = filledTemplate.replace(placeholderRegexes['customer.uuid'], customer.uuid);
    }

    if(variables.includes('customer.firstname')){
      const customerFirstName = customer.firstName?customer.firstName:'';
      filledTemplate = filledTemplate.replace(placeholderRegexes['customer.firstname'], customerFirstName);
    }
    return filledTemplate;
  }

  private async getShorterUrl(url:string):Promise<string | undefined>{
    const [shorterUrl, createShorterUrlError] = await this.bitlyRepository.createShorterUrl({ url });
    if(createShorterUrlError){
      this.sendMessageErrorStack.push(createShorterUrlError);
      return undefined;
    }
    return shorterUrl.url;
  }
  private findLinks(body:string):string[]{
    const pattern =
    /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/g;
    return body.match(pattern) || [];
  }

  private async sendMessage(customer: CoachedCustomer,
    messageDetail: PurchaseDateBasedAutoMessage | SequenceBasedAutoMessage): Promise<string | undefined> {
    let customerChannelId = customer.twilioChannelSid;

    // If the customer does not already have a Twilio channel ID, register one for them
    if (!customerChannelId) {
      const twilioChannelSid =
      await this.registerTwilioChannelSidToCustomer(customer);

      customerChannelId = twilioChannelSid;
    }

    const coachPhone = customer.coach.phone;
    const customerPhone = customer.phone;
    const webPageUrls = [];
    const mediaUrls = [];

    if (messageDetail.media && messageDetail.media.length) {
      for(const { urlTemplate, type } of messageDetail.media){
        const mediaUrl = this.replaceTemplateVariableWithValue(urlTemplate, customer);
        if (type === 'webPage') {
          webPageUrls.push(mediaUrl);
        } else {
          mediaUrls.push(mediaUrl);
        }
      }
    }

    // Replace template variables in the message body and append the web page URLs
    let body = messageDetail.body;
    body = this.replaceTemplateVariableWithValue(body, customer);
    body += webPageUrls.length ? '\n\n' + webPageUrls.join('\n\n') : '';
    const links = this.findLinks(body);
    console.log('links1: ', links);

    // If there are long (> 40) links in body, make them shorter
    for (const link of links) {

      if (link.length > 40) {
        const shortUrl = await this.getShorterUrl(link);
        console.log('shortUrl: ', shortUrl);
        if(!shortUrl) break;
        body = body.replace(link, shortUrl);
        console.log('body: ', body);
      }
    }
    // Send the text message
    const [, sendTextMessageError] = await this.twilioRepository.sendTextMessage({ customerChannelId, author: 'AUTO MESSAGE', body });
    if (sendTextMessageError) {
      this.sendMessageErrorStack.push(sendTextMessageError);
      return undefined;
    }

    // Once we send something, even if media might not be sent, create the history.
    if(messageDetail.type === 'sequenceBased'){
      await this.sequentBasedMessageRepository.createCustomerSequenceBasedAutoMessagesHistory(
        { customerId: customer.id, sequenceBasedAutoMessageId: messageDetail.id });
    }

    if (mediaUrls.length) {
      const [, sendMediaError] = await this.twilioRepository.sendMedia({ coachPhone, customerPhone, mediaUrls });
      if (sendMediaError) {
        this.sendMessageErrorStack.push(sendMediaError);
        return undefined;
      }
    }

    return body;
  }

  private async getCustomerDaysSincePurchase( customerId :number):Promise<number>{
    // Get customer's days since their purchase
    const { daysSincePurchase } = await
    this.purchaseDateBasedMessageRepository.getCustomerDaysSincePurchase({ customerId });

    return daysSincePurchase;
  }

  private async getCustomerLastSequenceAutoMessage( customerId :number ):
  Promise<{lastSequentBasedMessageDate:Date, lastSequentBasedMessageSequence:number}>{
    // Get the last sequence based auto message data for the current customer
    const lastSequenceBasedAutoMessageData = await
    this.sequentBasedMessageRepository.getCustomerLastSequenceBasedAutoMessageData({ customerId });

    // If customers has no last message, then set default values
    const { lastSequentBasedMessageDate = new Date('2000-01-01'), lastSequentBasedMessageSequence = 0 } = lastSequenceBasedAutoMessageData;

    return { lastSequentBasedMessageDate, lastSequentBasedMessageSequence };
  }

  private findSendingMessage(customer:CoachedCustomer,
    purchaseDateBasedAutoMessages:PurchaseDateBasedAutoMessage[],
    sequenceBasedAutoMessages: SequenceBasedAutoMessage[]):
    PurchaseDateBasedAutoMessage | SequenceBasedAutoMessage | undefined{
    let sendingMessage: PurchaseDateBasedAutoMessage | SequenceBasedAutoMessage | undefined;

    const purchaseDateBasedMatchingMessage = purchaseDateBasedAutoMessages.find(message =>
      message.delayDaysSincePurchase === customer.daysSincePurchase);
    if(purchaseDateBasedMatchingMessage){
      sendingMessage = purchaseDateBasedMatchingMessage;
    } else if(customer.daysSincePurchase > 2){ // The first welcome message will be sent on the 1st day. So do not send a sequent message on the 0th day.
      const today = new Date();
      const timeSinceLastMessage =
          today.getTime() - customer.sequenceBasedAutoMessageData.lastSequentBasedMessageDate.getTime();
      const daysSinceLastMessage = Math.floor(timeSinceLastMessage / 86400000);
      const hasIntervalPassedSinceLastMessage =
            customer.sequenceBasedAutoMessageInterval <= daysSinceLastMessage;

      if(hasIntervalPassedSinceLastMessage){
        const sequentBasedMatchingMessage = sequenceBasedAutoMessages.find(message =>
          message.sequence === customer.sequenceBasedAutoMessageData.lastSequentBasedMessageSequence+1);
        if(!sequentBasedMatchingMessage){
          this.sendMessageErrorStack.push({ name: 'findSendingMessage failed', message: `No more sequence is found. Customer ID ${customer.id} may reach to the end of the sequence` });
          return undefined;
        }
        sendingMessage = sequentBasedMatchingMessage;
      }
    }
    return sendingMessage;
  }

  private getCustomerMessagePreferenceTime(date = pstTime()):sendAt{

    const currentHour = date;
    if(0 <= currentHour && currentHour < 3) return 'at0';
    if(3 <= currentHour && currentHour < 6) return 'at3';
    if(6 <= currentHour && currentHour < 9) return 'at6';
    if(9 <= currentHour && currentHour < 12) return 'at9';
    if(12 <= currentHour && currentHour < 15) return 'at12';
    if(15 <= currentHour && currentHour < 18) return 'at15';
    if(18 <= currentHour && currentHour < 21) return 'at18';
    if(21 <= currentHour) return 'at21';
    return 'at9';
  }

  async sendAutoMessage():
  Promise<ReturnValueType<string>> {
    try{
      const customerMessagePreferenceTime = this.getCustomerMessagePreferenceTime();
      console.log('customerMessagePreferenceTime', customerMessagePreferenceTime);
      // Get only active coached customers
      const sendableCoachedCustomers =
    await this.coachRepository.getActiveCoachedCustomersBySendAt({ sendAt: customerMessagePreferenceTime });
      if(!sendableCoachedCustomers.length) return;
      console.log('sendableCoachedCustomers.length', sendableCoachedCustomers.length);
      const targetCustomers:CoachedCustomer[] = [];
      const daysSet: Set<number> = new Set();
      const sequenceSet: Set<number> = new Set();
      for(const customer of sendableCoachedCustomers){
        try{
          const customerDaysSincePurchase = await this.getCustomerDaysSincePurchase(customer.id);
          daysSet.add(customerDaysSincePurchase);

          const { lastSequentBasedMessageDate, lastSequentBasedMessageSequence } =
          await this.getCustomerLastSequenceAutoMessage(customer.id);
          const nextSequence = lastSequentBasedMessageSequence+1;
          sequenceSet.add(nextSequence);

          // Push the current customer to the customers array, along with the daysSincePurchase and sequenceBasedAutoMessageData
          targetCustomers.push({
            ...customer,
            daysSincePurchase: customerDaysSincePurchase,
            sequenceBasedAutoMessageData:
            { lastSequentBasedMessageDate, lastSequentBasedMessageSequence },
          });
        }catch(e){
          this.getCustomerDataErrorStack.push(new Error(e));
          continue;
        }
      }
      const uniqueDays = Array.from(daysSet);
      const uniqueSequences = Array.from(sequenceSet);
      const purchaseDateBasedAutoMessages =
    await this.purchaseDateBasedMessageRepository.getPurchaseDateBasedAutoMessagesByDays({ days: uniqueDays });

      const sequenceBasedAutoMessages =
    await this.sequentBasedMessageRepository.getSequenceBasedAutoMessagesBySequences({ sequences: uniqueSequences });

      for (const customer of targetCustomers) {
        try{
          const sendingMessage=
          this.findSendingMessage(customer, purchaseDateBasedAutoMessages, sequenceBasedAutoMessages );

          if(sendingMessage){
            const sendMessage = await this.sendMessage(customer, sendingMessage);
            if (!sendMessage) {
              continue;
            }

          }

        }catch(e){
          this.sendMessageErrorStack.push(new Error(e));
          continue;
        }
      }

      if (this.getCustomerDataErrorStack.length || this.sendMessageErrorStack.length) {
        const message = this.getCustomerDataErrorStack.length && this.sendMessageErrorStack.length ? 'Both getCustomerDataErrorStack and sendMessageErrorStack error' :
          this.getCustomerDataErrorStack.length ? 'getCustomerDataErrorStack error' : 'sendMessageErrorStack error';
        throw {
          message,
          code: 500,
          details: {
            getCustomerDataErrorStack: this.getCustomerDataErrorStack,
            sendMessageErrorStack: this.sendMessageErrorStack,
          },
        };
      }

      return ['OK'];
    } catch(e){
      // eslint-disable-next-line no-console
      console.log(e);
      throw new Error(e);
    }
  }
}
