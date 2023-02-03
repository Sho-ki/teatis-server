import { Global, Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CustomerSurveyResponseRepository } from '@Repositories/teatisDB/customer/customerSurveyResponse.repository';
import { PostPostPurchaseSurveyUsecase } from '@Usecases/postPurcahseSurvey/postPostPurchaseSurvey.usecase';
import { ProductGeneralRepository } from '@Repositories/teatisDB/product/productGeneral.repository';
import { ShipheroRepository } from '@Repositories/shiphero/shiphero.repository';
import { CustomerGeneralRepository } from '@Repositories/teatisDB/customer/customerGeneral.repository';
import { PostPurchaseSurveyController } from './postPurchaseSurvey.controller';
import { GetPostPurchaseSurveyUsecase } from '../../../usecases/postPurcahseSurvey/getPostPurchaseSurvey.usecase';
import { SurveyQuestionsRepository } from '../../../repositories/teatisDB/survey/surveyQuestions.repository';

@Global()
@Module({
  controllers: [PostPurchaseSurveyController],
  providers: [
    {
      provide: 'CustomerGeneralRepositoryInterface',
      useClass: CustomerGeneralRepository,
    },
    {
      provide: 'ShipheroRepositoryInterface',
      useClass: ShipheroRepository,
    },
    {
      provide: 'ProductGeneralRepositoryInterface',
      useClass: ProductGeneralRepository,
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

    PostPurchaseSurveyController,
    PrismaService,
  ],

  exports: [PostPurchaseSurveyController],
})
export class PostPurchaseSurveyModule {}
