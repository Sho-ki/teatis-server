import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

import { PrePurchaseSurveyController } from './prePurchaseSurvey.controller';
import { PostPrePurchaseSurveyUsecase2 } from '@Usecases/prePurchaseSurvey/postPrePurchaseSurvey2.usecase';
import { CustomerGeneralRepository } from '@Repositories/teatisDB/customer/customerGeneral.repository';
import { GetPrePurchaseSurveyUsecase } from '@Usecases/prePurchaseSurvey/getPrePurchaseSurvey.usecase';
import { SurveyQuestionsRepository } from '@Repositories/teatisDB/survey/surveyQuestions.repository';
import { CustomerSurveyResponseRepository } from '../../../repositories/teatisDB/customer/customerSurveyResponse.repository';
import { CustomerSurveyHistoryRepository } from '../../../repositories/teatisDB/customer/customerSurveyResponseHistory.repository';

@Module({
  controllers: [PrePurchaseSurveyController],
  providers: [
    {
      provide: 'CustomerSurveyHistoryRepositoryInterface',
      useClass: CustomerSurveyHistoryRepository,
    },
    {
      provide: 'CustomerSurveyResponseRepositoryInterface',
      useClass: CustomerSurveyResponseRepository,
    },
    {
      provide: 'PostPrePurchaseSurveyUsecase2Interface',
      useClass: PostPrePurchaseSurveyUsecase2,
    },
    {
      provide: 'GetPrePurchaseSurveyUsecaseInterface',
      useClass: GetPrePurchaseSurveyUsecase,
    },
    {
      provide: 'SurveyQuestionsRepositoryInterface',
      useClass: SurveyQuestionsRepository,
    },
    {
      provide: 'CustomerGeneralRepositoryInterface',
      useClass: CustomerGeneralRepository,
    },
    PrismaService,
    PrePurchaseSurveyController,
  ],
  exports: [PrePurchaseSurveyController],
})
export class PrePurchaseSurveyModule {}
