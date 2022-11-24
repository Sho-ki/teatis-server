import { Module } from '@nestjs/common';
import { PrismaService } from '../../../prisma.service';
import { TemporaryPrePurchaseSurveyRepository } from '../../../repositories/teatisDB/temporaryPrePurchaseSurvey/temporaryPrePurchaseSurvey.repository';
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
      provide: 'TemporaryPrePurchaseSurveyRepositoryInterface',
      useClass: TemporaryPrePurchaseSurveyRepository,
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
