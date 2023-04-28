/* eslint-disable no-console */
import {  Inject, Injectable } from '@nestjs/common';
import { ReturnValueType } from '@Filters/customError';

import { CoachRepositoryInterface } from '@Repositories/teatisDB/coach/coach.repository';
import { AutoMessageRepositoryInterface } from '@Repositories/teatisDB/autoMessage/autoMessage.repository';
import { CoachedCustomer } from '@Domains/CoachedCustomer';
import { TwilioRepositoryInterface } from '../../repositories/twilio/twilio.repository';
import { CustomerGeneralRepositoryInterface } from '../../repositories/teatisDB/customer/customerGeneral.repository';
import { PurchaseDateBasedAutoMessage } from '../../domains/AutoMessage';
import { BitlyRepositoryInterface } from '../../repositories/bitly/bitly.repository';
import { CustomerRewardTokenRepositoryInterface } from '../../repositories/teatisDB/customerRewardToken/customerRewardToken.repository';

export interface SendWelcomeMessageUsecaseInterface {
  execute():
  Promise<ReturnValueType<string>>;
}

enum TwilioError {
  invalidPhoneNumber = 'Invalid phone number'
}
@Injectable()
export class SendWelcomeMessageUsecase
implements SendWelcomeMessageUsecaseInterface
{
  private sendMessageErrorStack = [];
  private getCustomerDataErrorStack=[];
  constructor(

  @Inject('AutoMessageRepositoryInterface')
  private readonly autoMessageRepository: AutoMessageRepositoryInterface,
  @Inject('CoachRepositoryInterface')
  private readonly coachRepository: CoachRepositoryInterface,
  @Inject('TwilioRepositoryInterface')
  private readonly twilioRepository: TwilioRepositoryInterface,
  @Inject('CustomerGeneralRepositoryInterface')
  private readonly customerGeneralRepository: CustomerGeneralRepositoryInterface,
  @Inject('BitlyRepositoryInterface')
  private readonly bitlyRepository: BitlyRepositoryInterface,
  @Inject('CustomerRewardTokenRepositoryInterface')
  private readonly customerRewardTokenRepository: CustomerRewardTokenRepositoryInterface,

  ) {}

  private async registerTwilioChannelSidToCustomer(customer:CoachedCustomer): Promise<string | undefined>{
    const customerType = customer.customerType === 'standard'? ``: `(${customer.customerType.slice(0, 1).toUpperCase()})`;
    const channelName = `${customerType}${customer.firstName} ${customer.lastName?customer.lastName:''} - ID:${customer.id}`;
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
      'customer.totalPoints': /\$\{ *customer\.totalPoints *\}/g,
    };

    let filledTemplate = template;
    if(variables.includes('customer.uuid')){
      filledTemplate = filledTemplate.replace(placeholderRegexes['customer.uuid'], customer.uuid);
    }

    if(variables.includes('customer.firstname')){
      const customerFirstName = customer.firstName?customer.firstName:'';
      filledTemplate = filledTemplate.replace(placeholderRegexes['customer.firstname'], customerFirstName);
    }

    if(variables.includes('customer.totalPoints')){
      filledTemplate = filledTemplate.replace(placeholderRegexes['customer.totalPoints'], customer.totalPoints.toString());
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
    messageDetail: PurchaseDateBasedAutoMessage): Promise<string | undefined> {
    let customerChannelId = customer.twilioChannelSid;
    console.log('messageDetail: ', messageDetail);

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

    for (const link of links) {
      let processedLink = link;

      if (link.includes('weekly-check-in')) {
        const [customerRewardToken] = await this.customerRewardTokenRepository.createCustomerRewardToken(
          { customerId: customer.id });
        const separator = link.includes('?') ? '&' : '?';
        processedLink += `${separator}point_token=${customerRewardToken.pointToken}`;
      }

      const shortUrl = await this.getShorterUrl(processedLink);
      console.log('shortUrl: ', shortUrl);

      if (!shortUrl) break;

      body = body.replace(link, shortUrl);
      console.log('body: ', body);
    }
    // Send the text message
    const [, sendTextMessageError] = await this.twilioRepository.sendTextMessage({ customerChannelId, author: 'AUTO MESSAGE', body });
    if (sendTextMessageError) {
      this.sendMessageErrorStack.push(sendTextMessageError);
      return undefined;
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

  async execute():
  Promise<ReturnValueType<string>> {
    try{
      // Get only active coached customers
      const [targetCustomers] =
    await this.coachRepository.getActiveCoachedCustomersPurchasedWithinOneHour();
      console.log('targetCustomers: ', targetCustomers);
      if(!targetCustomers.length) return;
      console.log('sendableCoachedCustomers.length', targetCustomers.length);

      const autoMessages = await this.autoMessageRepository.getPurchaseDateBasedAutoMessagesByDays({ days: [0] });
      const welcomeMessage = autoMessages[0];
      for (const customer of targetCustomers) {
        try{
          const sendMessage = await this.sendMessage(customer, welcomeMessage);
          if (!sendMessage) {
            continue;
          }

        }catch(e){
          this.sendMessageErrorStack.push(new Error(e));
          continue;
        }
      }
      console.log('this.sendMessageErrorStack', this.sendMessageErrorStack);

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
      console.log(e.message);
      throw new Error(e);
    }
  }
}
