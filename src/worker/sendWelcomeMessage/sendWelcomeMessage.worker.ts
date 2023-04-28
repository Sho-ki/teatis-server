/* eslint-disable no-console */
import { NestFactory } from '@nestjs/core';
import { WorkerModule } from '../worker.module';
import { SendWelcomeMessageService } from './sendWelcomeMessage.service';

export const executeSendWelcomeMessage= async (method:string) => {
  if (method === 'POST') {
    console.log(`THIS IS POST`);

    const workerApp = await NestFactory.createApplicationContext(WorkerModule);

    const service = workerApp.get(SendWelcomeMessageService);
    await service.sendWelcomeMessage();
    await workerApp.close();
  }
  console.log('END');
};
