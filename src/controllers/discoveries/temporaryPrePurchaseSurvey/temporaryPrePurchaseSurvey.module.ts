import { Module } from '@nestjs/common';
import { PrismaService } from '../../../prisma.service';
import { GetTemporaryPrePurchaseSurveyUsecase } from '../../../usecases/prePurchaseSurvey/getTemporaryPrePurchaseSurvey.usecase';
import { PostTemporaryPrePurchaseSurveyUsecase } from '../../../usecases/prePurchaseSurvey/postTemporaryPrePurchaseSurvey.usecase';
import { TemporaryPrePurchaseSurveyController } from './temporaryPrePurchaseSurvey.controller';

@Module({
  controllers: [TemporaryPrePurchaseSurveyController],
  providers: [

    {
      provide: 'GetTemporaryPrePurchaseSurveyUsecaseInterface',
      useClass: GetTemporaryPrePurchaseSurveyUsecase,
    },
    {
      provide: 'PostTemporaryPrePurchaseSurveyUsecaseInterface',
      useClass: PostTemporaryPrePurchaseSurveyUsecase,
    },
    TemporaryPrePurchaseSurveyController,
    PrismaService,
  ],
  exports: [TemporaryPrePurchaseSurveyController],
})
export class TemporaryPrePurchaseSurveysModule {}
