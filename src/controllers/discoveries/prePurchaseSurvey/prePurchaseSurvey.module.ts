import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

import { PrePurchaseSurveyController } from './prePurchaseSurvey.controller';
import { PostPrePurchaseSurveyNonSettingUsecase } from '@Usecases/prePurchaseSurvey/postPrePurchaseSurveyNonSetting.usecase';
import { GetPrePurchaseSurveyUsecase } from '@Usecases/prePurchaseSurvey/getPrePurchaseSurvey.usecase';
import { SurveyQuestionsRepository } from '@Repositories/teatisDB/survey/surveyQuestions.repository';
import { CustomerSurveyResponseRepository } from '../../../repositories/teatisDB/customer/customerSurveyResponse.repository';
import { CustomerSurveyHistoryRepository } from '../../../repositories/teatisDB/customer/customerSurveyResponseHistory.repository';
import { PostPrePurchaseSurveyUsecase } from '../../../usecases/prePurchaseSurvey/postPrePurchaseSurvey.usecase';
import { CoachRepository } from '../../../repositories/teatisDB/coach/coach.repository';
import { EmployerRepository } from '../../../repositories/teatisDB/employer/employer.repository';

@Module({
  controllers: [PrePurchaseSurveyController],
  providers: [
    {
      provide: 'EmployerRepositoryInterface',
      useClass: EmployerRepository,
    },
    {
      provide: 'CoachRepositoryInterface',
      useClass: CoachRepository,
    },
    {
      provide: 'PostPrePurchaseSurveyUsecaseInterface',
      useClass: PostPrePurchaseSurveyUsecase,
    },
    {
      provide: 'CustomerSurveyHistoryRepositoryInterface',
      useClass: CustomerSurveyHistoryRepository,
    },
    {
      provide: 'CustomerSurveyResponseRepositoryInterface',
      useClass: CustomerSurveyResponseRepository,
    },
    {
      provide: 'PostPrePurchaseSurveyNonSettingUsecaseInterface',
      useClass: PostPrePurchaseSurveyNonSettingUsecase,
    },
    {
      provide: 'GetPrePurchaseSurveyUsecaseInterface',
      useClass: GetPrePurchaseSurveyUsecase,
    },
    {
      provide: 'SurveyQuestionsRepositoryInterface',
      useClass: SurveyQuestionsRepository,
    },

    PrismaService,
    PrePurchaseSurveyController,
  ],
  exports: [PrePurchaseSurveyController],
})
export class PrePurchaseSurveyModule {}
