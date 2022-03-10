import { Module } from '@nestjs/common';
import { DiscoveriesController } from './discoveries.controller';
import { ShopifyRepo } from '../../repositories/shopify/shopify.repository';
import { TypeformRepo } from '../../repositories/typeform/typeform.repository';
import { PrismaService } from '../../prisma.service';
import { CustomerPrePurchaseSurveyRepo } from '../../repositories/teatisDB/customerRepo/customerPrePurchaseSurvey.repository';
import { GetPostPurchaseSurveyUseCase } from '../../usecases/postPurcahseSurvey/getPostPurchaseSurvey.usecase';
import { QuestionPostPurchaseSurveyRepo } from '../../repositories/teatisDB/questionRepo/questionPostPurchaseSurvey.repository';
import { CustomerPostPurchaseSurveyRepo } from '../../repositories/teatisDB/customerRepo/customerPostPurchaseSurvey.repository';
import { PostPostPurchaseSurveyUseCase } from '../../usecases/postPurcahseSurvey/postPostPurchaseSurvey.usecase';
import { ProductGeneralRepo } from '../../repositories/teatisDB/productRepo/productGeneral.repository';
import { GetRecommendProductsUseCase } from '../../usecases/prePurchaseSurvey/getRecommendProducts.usecase';
import { ShipheroRepo } from '../../repositories/shiphero/shiphero.repository';
import { UpdateCustomerBoxUsecase } from '../../usecases/customerBox/updateCustomerBox.usecase';
import { CustomerGeneralRepo } from '../../repositories/teatisDB/customerRepo/customerGeneral.repository';
import { CustomerUpdateCustomerBoxRepo } from '../../repositories/teatisDB/customerRepo/customerUpdateCustomerBox.repository';
import { TeatisJobs } from '../../repositories/teatisJobs/dbMigrationjob';
import { GetAllOptionsUsecase } from '../../usecases/prePurchaseSurvey/getAllOptions.usecase';

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
      provide: 'GetRecommendProductsUseCaseInterface',
      useClass: GetRecommendProductsUseCase,
    },
    {
      provide: 'GetAllOptionsUsecaseInterface',
      useClass: GetAllOptionsUsecase,
    },
    {
      provide: ' GetRecommendProductsUseCaseInterface',
      useClass: GetRecommendProductsUseCase,
    },
    {
      provide: 'GetPostPurchaseSurveyUseCaseInterface',
      useClass: GetPostPurchaseSurveyUseCase,
    },
    {
      provide: 'PostPostPurchaseSurveyUseCaseInterface',
      useClass: PostPostPurchaseSurveyUseCase,
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
// GetRecommendProductsUseCase,
// GetPostPurchaseSurveyUseCase,
// PostPostPurchaseSurveyUseCase,
// PrismaService,
// TeatisJobs,
