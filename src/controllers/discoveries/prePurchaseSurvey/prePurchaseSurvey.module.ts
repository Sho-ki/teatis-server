import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

import { PrePurchaseSurveyController } from './prePurchaseSurvey.controller';
import { PostPrePurchaseSurveyNonSettingUsecase } from '@Usecases/prePurchaseSurvey/postPrePurchaseSurveyNonSetting.usecase';
import { CustomerGeneralRepository } from '@Repositories/teatisDB/customer/customerGeneral.repository';
import { GetPrePurchaseSurveyUsecase } from '@Usecases/prePurchaseSurvey/getPrePurchaseSurvey.usecase';
import { SurveyQuestionsRepository } from '@Repositories/teatisDB/survey/surveyQuestions.repository';
import { CustomerSurveyResponseRepository } from '../../../repositories/teatisDB/customer/customerSurveyResponse.repository';
import { CustomerSurveyHistoryRepository } from '../../../repositories/teatisDB/customer/customerSurveyResponseHistory.repository';
import { ProductGeneralRepository } from '../../../repositories/teatisDB/product/productGeneral.repository';
import { PostPrePurchaseSurveyUsecase } from '../../../usecases/prePurchaseSurvey/postPrePurchaseSurvey.usecase';

@Module({
  controllers: [PrePurchaseSurveyController],
  providers: [
    {
      provide: 'PostPrePurchaseSurveyUsecaseInterface',
      useClass: PostPrePurchaseSurveyUsecase,
    },
    {
      provide: 'ProductGeneralRepositoryInterface',
      useClass: ProductGeneralRepository,
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
