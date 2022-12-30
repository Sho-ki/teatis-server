/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-console */
import { NestFactory } from '@nestjs/core';
import { WorkerModule } from '../worker.module';
import { SendAutoMessageService } from './sendAutoMessage.service';

// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();

module.exports.sendAutoMessage = async() => {
  // const workerApp = await NestFactory.createApplicationContext(WorkerModule);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  // const appService = workerApp.get(SendAutoMessageService);
  console.log('SUCCESS');
  // appService.sendAutoMessage();
  // await workerApp.close();
};
