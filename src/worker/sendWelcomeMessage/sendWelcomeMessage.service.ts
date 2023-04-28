import {  Inject, Injectable } from '@nestjs/common';
import { SendWelcomeMessageUsecaseInterface } from '@Usecases/twilio/sendWelcomeMessage.usecase';

@Injectable()
export class SendWelcomeMessageService {
  constructor(
    @Inject('SendWelcomeMessageUsecaseInterface')
    private sendWelcomeMessageUsecase: SendWelcomeMessageUsecaseInterface
  ) {}

  async sendWelcomeMessage() {
    await this.sendWelcomeMessageUsecase.execute();
  }
}
