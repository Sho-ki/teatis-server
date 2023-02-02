import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

import { PrePurchaseSurveyController } from './prePurchaseSurvey.controller';
import { CustomerPrePurchaseSurveyHistoryRepository } from '@Repositories/teatisDB/customer/customerSurveyResponseHistory.repository';
import { PostPrePurchaseSurveyUsecase2 } from '@Usecases/prePurchaseSurvey/postPrePurchaseSurvey2.usecase';
import { CustomerGeneralRepository } from '@Repositories/teatisDB/customer/customerGeneral.repository';

@Module({
  controllers: [PrePurchaseSurveyController],
  providers: [
    {
      provide: 'CustomerPrePurchaseSurveyHistoryRepositoryInterface',
      useClass: CustomerPrePurchaseSurveyHistoryRepository,
    },
    {
      provide: 'postPrePurchaseSurveyUsecase2Interface',
      useClass: PostPrePurchaseSurveyUsecase2,
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
