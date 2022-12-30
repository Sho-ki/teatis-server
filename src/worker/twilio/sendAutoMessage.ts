/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-console */
import { NestFactory } from '@nestjs/core';
import { Request, Response } from 'express';
import { WorkerModule } from '../worker.module';
import { SendAutoMessageService } from './sendAutoMessage.service';

// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();

module.exports.sendAutoMessage = async(req:Request, res:Response) => {
  const workerApp = await NestFactory.createApplicationContext(WorkerModule);
  console.log('SUCCESS');

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const appService = workerApp.get(SendAutoMessageService);
  appService.sendAutoMessage();
  await workerApp.close();
  res.end();
};
