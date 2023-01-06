/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-console */
import { NestFactory } from '@nestjs/core';
import { Request, Response } from 'express';
import { WorkerModule } from '../worker.module';
import { SendAutoMessageService } from './sendAutoMessage.service';

// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();

module.exports.sendAutoMessage = async(req:Request, res:Response) => {
  if (req.method === 'POST'){
    console.log('THIS IS POST');

    const workerApp = await NestFactory.createApplicationContext(WorkerModule);

    const appService = workerApp.get(SendAutoMessageService);
    appService.sendAutoMessage();
    await workerApp.close();
    console.log('SUCCESS');
  }
  console.log('END');
  res.end();
};

// const sendAutoMessage = async() => {
//   console.log('THIS IS POST');

//   const workerApp = await NestFactory.createApplicationContext(WorkerModule);

//   const appService = workerApp.get(SendAutoMessageService);
//   appService.sendAutoMessage();
//   await workerApp.close();
//   console.log('SUCCESS');
//   console.log('END');
// };

// sendAutoMessage();
