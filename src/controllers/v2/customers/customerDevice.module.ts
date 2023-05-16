import { Module } from '@nestjs/common';

import { GetCustomersGlucoseUsecase } from '../../../usecases/terraCustomerGlucose/getCustomerGlucose.usecase';
import { CustomerDeviceController } from './customerDevice.controller';
import { PrismaService } from '../../../prisma.service';

@Module({
  controllers: [CustomerDeviceController], exports: [CustomerDeviceController],
  providers: [
    {
      provide: 'GetCustomersGlucoseUsecaseInterface',
      useClass: GetCustomersGlucoseUsecase,
    },
    CustomerDeviceController,
    PrismaService,
  ],
})
export class CustomerDeviceModule {}
