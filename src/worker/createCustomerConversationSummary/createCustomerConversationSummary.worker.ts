/* eslint-disable no-console */
import { NestFactory } from '@nestjs/core';
import { WorkerModule } from '../worker.module';
import { CreateCustomerConversationSummary } from './createCustomerConversationSummary.service';

export const executeCreateCustomerConversationHistory= async (method:string) => {
  if (method === 'POST') {
    console.log(`THIS IS POST`);

    const workerApp = await NestFactory.createApplicationContext(WorkerModule);

    const service = workerApp.get(CreateCustomerConversationSummary);
    await service.createEmployeeOrder();
    await workerApp.close();
  }
  console.log('END');
};
