import { Inject, Injectable } from '@nestjs/common';
import { CreateCustomerConversationSummaryUsecaseInterface } from '../../usecases/chatGPT/createCustomerConversationSummary.usecase';

@Injectable()
export class CreateCustomerConversationSummaryService {
  constructor(
    @Inject('CreateCustomerConversationSummaryUsecaseInterface')
    private createCustomerConversationSummaryUsecase: CreateCustomerConversationSummaryUsecaseInterface
  ) {}

  async createCustomerConversationSummary() {
    await this.createCustomerConversationSummaryUsecase.createCustomerConversationSummary();
  }
}
