import { Module } from '@nestjs/common';
import { PrismaService } from '../../../prisma.service';

import { GetCoachCustomersUsecase } from '@Usecases/coaching/getCoachCustomers.usecase';
import { CoachingController } from './coaching.controller';
import { CoachRepository } from '@Repositories/teatisDB/coach/coach.repository';

@Module({
  controllers: [CoachingController],
  exports: [CoachingController],
  providers: [
    {
      provide: 'GetCoachCustomersUsecaseInterface',
      useClass: GetCoachCustomersUsecase,
    },
    {
      provide: 'CoachRepositoryInterface',
      useClass: CoachRepository,
    },
    CoachingController,
    PrismaService,
  ],
})
export class CoachingModule {}
