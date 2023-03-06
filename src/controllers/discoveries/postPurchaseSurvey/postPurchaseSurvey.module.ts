import { Global, Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { PostPostPurchaseSurveyUsecase } from '@Usecases/postPurcahseSurvey/postPostPurchaseSurvey.usecase';
import { PostPurchaseSurveyController } from './postPurchaseSurvey.controller';
import { GetPostPurchaseSurveyUsecase } from '../../../usecases/postPurcahseSurvey/getPostPurchaseSurvey.usecase';

@Global()
@Module({
  controllers: [PostPurchaseSurveyController],
  providers: [
    {
      provide: 'GetPostPurchaseSurveyUsecaseInterface',
      useClass: GetPostPurchaseSurveyUsecase,
    },
    {
      provide: 'PostPostPurchaseSurveyUsecaseInterface',
      useClass: PostPostPurchaseSurveyUsecase,
    },

    PostPurchaseSurveyController,
    PrismaService,
  ],

  exports: [PostPurchaseSurveyController],
})
export class PostPurchaseSurveyModule {}
