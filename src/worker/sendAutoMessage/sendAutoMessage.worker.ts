/* eslint-disable no-console */
import { NestFactory } from '@nestjs/core';
import { WorkerModule } from '../worker.module';
import { SendAutoMessageService } from './sendAutoMessage.service';

export const executeSendAutoMessage= async (method:string) => {
  if (method === 'POST') {
    console.log(`THIS IS POST`);

    const workerApp = await NestFactory.createApplicationContext(WorkerModule);

    const service = workerApp.get(SendAutoMessageService);
    await service.sendAutoMessage();
    await workerApp.close();
  }
  console.log('END');
};
