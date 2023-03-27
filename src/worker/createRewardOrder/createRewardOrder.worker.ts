/* eslint-disable no-console */
import { NestFactory } from '@nestjs/core';
import { WorkerModule } from '../worker.module';
import { CreateRewardOrderService } from './createRewardOrder.service';

// not in use now
export const executeCreateRewardOrder= async (method:string) => {
  if (method === 'POST') {
    console.log(`THIS IS POST`);

    const workerApp = await NestFactory.createApplicationContext(WorkerModule);

    const service = workerApp.get(CreateRewardOrderService);
    await service.createRewardOrder();
    await workerApp.close();
  }
  console.log('END');
};
