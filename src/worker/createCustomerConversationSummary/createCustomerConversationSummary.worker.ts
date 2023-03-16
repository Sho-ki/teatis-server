/* eslint-disable no-console */
import { NestFactory } from '@nestjs/core';
import { WorkerModule } from '../worker.module';
import { CreateCustomerConversationSummaryService } from './createCustomerConversationSummary.service';

export const executeCreateCustomerConversationSummary = async (method:string) => {
  if (method === 'POST') {
    console.log(`executeCreateCustomerConversationSummary`);

    const workerApp = await NestFactory.createApplicationContext(WorkerModule);

    const service = workerApp.get(CreateCustomerConversationSummaryService);
    await service.createCustomerConversationSummary();
    await workerApp.close();
  }
  console.log('END');
};
