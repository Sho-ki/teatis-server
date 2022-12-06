import { Module } from '@nestjs/common';
import { PrismaService } from '../../../prisma.service';

import { GetCoachCustomersUsecase } from '../../../usecases/coaching/getCoachCustomers.usecase';
import { CoachingController } from './coaching.controller';
import { CustomerCoachRepository } from '../../../repositories/teatisDB/coach/customerCoach.repository';

@Module({
  controllers: [CoachingController],
  exports: [CoachingController],
  providers: [
    {
      provide: 'GetCoachCustomersUsecaseInterface',
      useClass: GetCoachCustomersUsecase,
    },
    {
      provide: 'CustomerCoachRepositoryInterface',
      useClass: CustomerCoachRepository,
    },
    CoachingController,
    PrismaService,
  ],
})
export class CoachingModule {}
