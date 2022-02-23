import { Module } from '@nestjs/common';
import { DiscoveriesController } from './discoveries.controller';
import { ShopifyRepo } from '../../repositories/shopify/shopify.repository';
import { TypeformRepo } from '../../repositories/typeform/typeform.repository';
import { PrismaService } from '../../prisma.service';
import { CustomerPrePurchaseSurveyRepo } from '../../repositories/teatisDB/customerRepo/customerPrePurchaseSurvey.repository';
import { TeatisJobs } from '../../repositories/teatisJobs/dbMigrationjob';
import { GetPostPurchaseSurveyUseCase } from '../../useCases/postPurcahseSurvey/getPostPurchaseSurvey.usecase';
import { QuestionPostPurchaseSurveyRepo } from '../../repositories/teatisDB/questionRepo/questionPostPurchaseSurvey.repository';
import { CustomerPostPurchaseSurveyRepo } from '../../repositories/teatisDB/customerRepo/customerPostPurchaseSurvey.repository';
import { PostPostPurchaseSurveyUseCase } from '../../useCases/postPurcahseSurvey/postPostPurchaseSurvey.usecase';
import { ProductPostPurchaseSurveyRepo } from '../../repositories/teatisDB/productRepo/productPostPurchaseSurvey.repository';
import { GetRecommendProductsUseCase } from '../../useCases/prePurchaseSurvey/getRecommendProducts.usecase';
import { ShipheroRepo } from '../../repositories/shiphero/shiphero.repository';

@Module({
  controllers: [DiscoveriesController],
  providers: [
    {
      provide: 'CustomerPrePurchaseSurveyRepoInterface',
      useClass: CustomerPrePurchaseSurveyRepo,
    },
    {
      provide: 'CustomerPostPurchaseSurveyRepoInterface',
      useClass: CustomerPostPurchaseSurveyRepo,
    },
    {
      provide: 'ShipheroRepoInterface',
      useClass: ShipheroRepo,
    },
    {
      provide: 'ProductPostPurchaseSurveyRepoInterface',
      useClass: ProductPostPurchaseSurveyRepo,
    },
    {
      provide: 'TypeformRepoInterface',
      useClass: TypeformRepo,
    },
    {
      provide: 'QuestionPostPurchaseSurveyRepoInterface',
      useClass: QuestionPostPurchaseSurveyRepo,
    },
    {
      provide: 'ShopifyRepoInterface',
      useClass: ShopifyRepo,
    },
    DiscoveriesController,
    GetRecommendProductsUseCase,
    GetPostPurchaseSurveyUseCase,
    PostPostPurchaseSurveyUseCase,
    PrismaService,
    TeatisJobs,
  ],
  exports: [DiscoveriesController],
})
export class DiscoveriesModule {}

// DiscoveriesService,
// DatabasePrePurchaseSurveyRepo,
// CustomerPostPurchaseSurveyRepo,
// ConnectShipheroRepo,
// ProductPostPurchaseSurveyRepo,
// TypeformRepo,
// QuestionPostPurchaseSurveyRepo,
// ConnectShopifyRepo,
// GetRecommendProductsUseCase,
// GetPostPurchaseSurveyUseCase,
// PostPostPurchaseSurveyUseCase,
// PrismaService,
// TeatisJobs,
