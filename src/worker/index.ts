/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-console */
import { NestFactory } from '@nestjs/core';
import { Request, Response } from 'express';
import { UpdateOrderService } from './order/updateOrder.service';
import { SendAutoMessageService } from './twilio/sendAutoMessage.service';
import { WorkerModule } from './worker.module';

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

module.exports.updateOrder = async(req:Request, res:Response) => {
  if (req.method === 'POST'){
    console.log('THIS IS POST UPDATE ORDER');

    const workerApp = await NestFactory.createApplicationContext(WorkerModule);

    const appService = workerApp.get(UpdateOrderService);
    appService.checkAndUpdateOrder();
    await workerApp.close();
  }
  console.log('END');
  res.end();
};

// const updateOrder = async() => {
//   console.log('THIS IS POST');

//   const workerApp = await NestFactory.createApplicationContext(WorkerModule);

//   const appService = workerApp.get(UpdateOrderService);
//   appService.checkAndUpdateOrder();
//   await workerApp.close();
//   console.log('SUCCESS');
// };

// updateOrder();
