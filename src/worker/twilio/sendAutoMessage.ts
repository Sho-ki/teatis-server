import { NestFactory } from '@nestjs/core';
import { WorkerModule } from '../worker.module';
import { SendAutoMessageService } from './sendAutoMessage.service';

// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();

module.exports = async function sendAutoMessage(req, res) {
  const workerApp = await NestFactory.createApplicationContext(WorkerModule);
  const appService = workerApp.get(SendAutoMessageService);
  appService.sendAutoMessage();
  await workerApp.close();
  res.end();
};
