import { Module } from '@nestjs/common';
import { PrismaService } from '../../../prisma.service';

import { GetCoachedCustomersUsecase } from '@Usecases/coaching/getCoachedCustomers.usecase';
import { CoachingController } from './coaching.controller';
import { GetCustomerDetailUsecase } from '@Usecases/coaching/getCustomerDetail.usecase';

@Module({
  controllers: [CoachingController],
  exports: [CoachingController],
  providers: [

    {
      provide: 'GetCustomerDetailUsecaseInterface',
      useClass: GetCustomerDetailUsecase,
    },
    {
      provide: 'GetCoachedCustomersUsecaseInterface',
      useClass: GetCoachedCustomersUsecase,
    },
    CoachingController,
    PrismaService,
  ],
})
export class CoachingModule {}
