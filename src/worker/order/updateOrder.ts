/* eslint-disable no-console */
import { NestFactory } from '@nestjs/core';
import { Request, Response } from 'express';
import { WorkerModule } from '../worker.module';
import { UpdateOrderService } from './updateOrder.service';

// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();

// module.exports.updateOrder = async(req:Request, res:Response) => {
//   if (req.method === 'POST'){
//     console.log('THIS IS POST');

//     const workerApp = await NestFactory.createApplicationContext(WorkerModule);

//     const appService = workerApp.get(UpdateOrderService);
//     appService.checkUpdateOrderWebhook();
//     await workerApp.close();
//     console.log('SUCCESS');
//   }
//   console.log('END');
//   res.end();
// };

const updateOrder = async() => {
  console.log('THIS IS POST');

  const workerApp = await NestFactory.createApplicationContext(WorkerModule);

  const appService = workerApp.get(UpdateOrderService);
  appService.checkAndUpdateOrder();
  await workerApp.close();
  console.log('SUCCESS');
};

updateOrder();
