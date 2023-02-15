import { Module } from '@nestjs/common';
import { CustomerGeneralRepository } from '@Repositories/teatisDB/customer/customerGeneral.repository';
import { CustomerSurveyResponseRepository } from '@Repositories/teatisDB/customer/customerSurveyResponse.repository';
import { CustomerSurveyHistoryRepository } from '@Repositories/teatisDB/customer/customerSurveyResponseHistory.repository';
import { SurveyQuestionsRepository } from '@Repositories/teatisDB/survey/surveyQuestions.repository';
import { GetWeeklyCheckInQuestionsUsecase } from '@Usecases/weeklyCheckIns/getWeeklyCheckInQuestions.usecase';
import { PostWeeklyCheckInQuestionsUsecase } from '@Usecases/weeklyCheckIns/postWeeklyCheckInQuestions.usecase';
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
    {
      provide: 'SurveyQuestionsRepositoryInterface',
      useClass: SurveyQuestionsRepository,
    },
    {
      provide: 'CustomerGeneralRepositoryInterface',
      useClass: CustomerGeneralRepository,
    },
    {
      provide: 'CustomerSurveyHistoryRepositoryInterface',
      useClass: CustomerSurveyHistoryRepository,
    },
    {
      provide: 'CustomerSurveyResponseRepositoryInterface',
      useClass: CustomerSurveyResponseRepository,
    },
    PrismaService,
    WeeklyCheckInController,
  ],
  exports: [WeeklyCheckInController],
})
export class WeeklyCheckInModule {}
