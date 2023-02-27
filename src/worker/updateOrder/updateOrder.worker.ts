/* eslint-disable no-console */
import { NestFactory } from '@nestjs/core';
import { WorkerModule } from '../worker.module';
import { UpdateOrderService } from './updateOrder.service';

export const executeUpdateOrder = async (method: string) => {
  if (method === 'POST') {
    console.log(`THIS IS POST`);

    const workerApp = await NestFactory.createApplicationContext(WorkerModule);

    const service = workerApp.get(UpdateOrderService);
    await service.checkAndUpdateOrder();
    await workerApp.close();
  }
  console.log('END');
};
