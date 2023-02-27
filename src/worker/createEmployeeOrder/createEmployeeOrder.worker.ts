/* eslint-disable no-console */
import { NestFactory } from '@nestjs/core';
import { WorkerModule } from '../worker.module';
import { CreateEmployeeOrderService } from './createEmployeeOrder.service';

export const executeCreateEmployeeOrder= async (method:string) => {
  if (method === 'POST') {
    console.log(`THIS IS POST`);

    const workerApp = await NestFactory.createApplicationContext(WorkerModule);

    const service = workerApp.get(CreateEmployeeOrderService);
    await service.createEmployeeOrder();
    await workerApp.close();
  }
  console.log('END');
};
