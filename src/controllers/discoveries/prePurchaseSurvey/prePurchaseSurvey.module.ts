import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

import { PrePurchaseSurveyController } from './prePurchaseSurvey.controller';
import { PostPrePurchaseSurveyNonSettingUsecase } from '@Usecases/prePurchaseSurvey/postPrePurchaseSurveyNonSetting.usecase';
import { GetPrePurchaseSurveyUsecase } from '@Usecases/prePurchaseSurvey/getPrePurchaseSurvey.usecase';
import { PostPrePurchaseSurveyUsecase } from '../../../usecases/prePurchaseSurvey/postPrePurchaseSurvey.usecase';

@Module({
  controllers: [PrePurchaseSurveyController],
  providers: [
    {
      provide: 'PostPrePurchaseSurveyUsecaseInterface',
      useClass: PostPrePurchaseSurveyUsecase,
    },
    {
      provide: 'PostPrePurchaseSurveyNonSettingUsecaseInterface',
      useClass: PostPrePurchaseSurveyNonSettingUsecase,
    },
    {
      provide: 'GetPrePurchaseSurveyUsecaseInterface',
      useClass: GetPrePurchaseSurveyUsecase,
    },
    PrismaService,
    PrePurchaseSurveyController,
  ],
  exports: [PrePurchaseSurveyController],
})
export class PrePurchaseSurveyModule {}
