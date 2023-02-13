import { Module } from '@nestjs/common';
import { GetWeeklyCheckInQuestionsUsecase } from '@Usecases/weeklyCheckin/getWeeklyCheckinQuestions.usecase';
import { PrismaService } from 'src/prisma.service';
import { WeeklyCheckInController } from './weeklyCheckIn.controller';

@Module({
  controllers: [WeeklyCheckInController],
  providers: [
    {
      provide: 'GetWeeklyCheckInQuestionsUsecaseInterface',
      useClass: GetWeeklyCheckInQuestionsUsecase,
    },
    PrismaService,
  ],
  exports: [WeeklyCheckInController],
})
export class PrePurchaseSurveyModule {}
