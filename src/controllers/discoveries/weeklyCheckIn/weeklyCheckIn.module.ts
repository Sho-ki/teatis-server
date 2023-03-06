import { Module } from '@nestjs/common';
import { GetWeeklyCheckInQuestionsUsecase } from '@Usecases/weeklyCheckIn/getWeeklyCheckInQuestions.usecase';
import { PostWeeklyCheckInQuestionsUsecase } from '@Usecases/weeklyCheckIn/postWeeklyCheckInQuestions.usecase';
import { PrismaService } from 'src/prisma.service';
import { WeeklyCheckInController } from './weeklyCheckIn.controller';

@Module({
  controllers: [WeeklyCheckInController],
  providers: [
    {
      provide: 'GetWeeklyCheckInQuestionsUsecaseInterface',
      useClass: GetWeeklyCheckInQuestionsUsecase,
    },
    {
      provide: 'PostWeeklyCheckInQuestionsUsecaseInterface',
      useClass: PostWeeklyCheckInQuestionsUsecase,
    },
    PrismaService,
    WeeklyCheckInController,
  ],
  exports: [WeeklyCheckInController],
})
export class WeeklyCheckInModule {}
