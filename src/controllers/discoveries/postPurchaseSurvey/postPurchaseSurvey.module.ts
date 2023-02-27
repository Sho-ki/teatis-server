import { Global, Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CustomerSurveyResponseRepository } from '@Repositories/teatisDB/customer/customerSurveyResponse.repository';
import { PostPostPurchaseSurveyUsecase } from '@Usecases/postPurcahseSurvey/postPostPurchaseSurvey.usecase';
import { ShipheroRepository } from '@Repositories/shiphero/shiphero.repository';
import { PostPurchaseSurveyController } from './postPurchaseSurvey.controller';
import { GetPostPurchaseSurveyUsecase } from '../../../usecases/postPurcahseSurvey/getPostPurchaseSurvey.usecase';
import { SurveyQuestionsRepository } from '../../../repositories/teatisDB/survey/surveyQuestions.repository';
import { CustomerSurveyHistoryRepository } from '../../../repositories/teatisDB/customer/customerSurveyResponseHistory.repository';

@Global()
@Module({
  controllers: [PostPurchaseSurveyController],
  providers: [

    {
      provide: 'ShipheroRepositoryInterface',
      useClass: ShipheroRepository,
    },
    {
      provide: 'GetPostPurchaseSurveyUsecaseInterface',
      useClass: GetPostPurchaseSurveyUsecase,
    },
    {
      provide: 'PostPostPurchaseSurveyUsecaseInterface',
      useClass: PostPostPurchaseSurveyUsecase,
    },
    {
      provide: 'SurveyQuestionsRepositoryInterface',
      useClass: SurveyQuestionsRepository,
    },
    {
      provide: 'CustomerSurveyResponseRepositoryInterface',
      useClass: CustomerSurveyResponseRepository,
    },
    {
      provide: 'CustomerSurveyHistoryRepositoryInterface',
      useClass: CustomerSurveyHistoryRepository,
    },

    PostPurchaseSurveyController,
    PrismaService,
  ],

  exports: [PostPurchaseSurveyController],
})
export class PostPurchaseSurveyModule {}
