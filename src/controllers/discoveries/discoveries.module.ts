import { Module } from '@nestjs/common';
import { DiscoveriesController } from './discoveries.controller';
import { ShopifyRepo } from 'src/repositories/shopify/shopify.repository';
import { TypeformRepo } from 'src/repositories/typeform/typeform.repository';
import { PrismaService } from 'src/prisma.service';
import { CustomerPrePurchaseSurveyRepo } from 'src/repositories/teatisDB/customerRepo/customerPrePurchaseSurvey.repository';
import { GetPostPurchaseSurveyUsecase } from '@Usecases/postPurcahseSurvey/getPostPurchaseSurvey.usecase';
import { QuestionPostPurchaseSurveyRepo } from 'src/repositories/teatisDB/questionRepo/questionPostPurchaseSurvey.repository';
import { CustomerPostPurchaseSurveyRepo } from 'src/repositories/teatisDB/customerRepo/customerPostPurchaseSurvey.repository';
import { PostPostPurchaseSurveyUsecase } from '@Usecases/postPurcahseSurvey/postPostPurchaseSurvey.usecase';
import { ProductGeneralRepo } from 'src/repositories/teatisDB/productRepo/productGeneral.repository';
import { GetRecommendProductsUsecase } from '@Usecases/prePurchaseSurvey/getRecommendProducts.usecase';
import { ShipheroRepo } from 'src/repositories/shiphero/shiphero.repository';
import { UpdateCustomerBoxUsecase } from '@Usecases/customerBox/updateCustomerBox.usecase';
import { CustomerGeneralRepo } from 'src/repositories/teatisDB/customerRepo/customerGeneral.repository';
import { CustomerUpdateCustomerBoxRepo } from 'src/repositories/teatisDB/customerRepo/customerUpdateCustomerBox.repository';
import { TeatisJobs } from 'src/repositories/teatisJobs/dbMigrationjob';
import { GetAllOptionsUsecase } from '@Usecases/prePurchaseSurvey/getAllOptions.usecase';

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
      provide: 'CustomerGeneralRepoInterface',
      useClass: CustomerGeneralRepo,
    },
    {
      provide: 'CustomerUpdateCustomerBoxRepoInterface',
      useClass: CustomerUpdateCustomerBoxRepo,
    },
    {
      provide: 'ShipheroRepoInterface',
      useClass: ShipheroRepo,
    },
    {
      provide: 'ProductGeneralRepoInterface',
      useClass: ProductGeneralRepo,
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
    {
      provide: 'GetRecommendProductsUsecaseInterface',
      useClass: GetRecommendProductsUsecase,
    },
    {
      provide: 'GetAllOptionsUsecaseInterface',
      useClass: GetAllOptionsUsecase,
    },
    {
      provide: ' GetRecommendProductsUsecaseInterface',
      useClass: GetRecommendProductsUsecase,
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
      provide: 'UpdateCustomerBoxUsecaseInterface',
      useClass: UpdateCustomerBoxUsecase,
    },

    TeatisJobs,
    DiscoveriesController,
    PrismaService,
  ],
  exports: [DiscoveriesController],
})
export class DiscoveriesModule {}

// DiscoveriesService,
// DatabasePrePurchaseSurveyRepo,
// CustomerPostPurchaseSurveyRepo,
// ConnectShipheroRepo,
// ProductGeneralRepo,
// TypeformRepo,
// QuestionPostPurchaseSurveyRepo,
// ConnectShopifyRepo,
// GetRecommendProductsUsecase,
// GetPostPurchaseSurveyUsecase,
// PostPostPurchaseSurveyUsecase,
// PrismaService,
// TeatisJobs,
