import {  Inject, Injectable } from '@nestjs/common';
import { SendAutoMessageUsecaseInterface } from '@Usecases/twilio/sendAutoMessage.usecase';

@Injectable()
export class SendAutoMessageService {
  constructor(
    @Inject('SendAutoMessageUsecaseInterface')
    private sendAutoMessageUsecase: SendAutoMessageUsecaseInterface
  ) {}

  async sendAutoMessage() {
    await this.sendAutoMessageUsecase.sendAutoMessage();
  }
}
