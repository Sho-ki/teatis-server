import { NestFactory } from '@nestjs/core';
import { WorkerModule } from '../worker.module';
import { SendAutoMessageService } from './sendAutoMessage.service';

// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();

exports.sendAutoMessage = async(req, res) => {
  const workerApp = await NestFactory.createApplicationContext(WorkerModule);
  const appService = workerApp.get(SendAutoMessageService);
  appService.sendAutoMessage();
  await workerApp.close();
  res.end();
};
