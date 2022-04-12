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
import { ShipheroRepo } from 'src/repositories/shiphero/shiphero.repository';
import { UpdateCustomerBoxUsecase } from '@Usecases/customerBoxUpdate/updateCustomerBox.usecase';
import { CustomerGeneralRepo } from 'src/repositories/teatisDB/customerRepo/customerGeneral.repository';
import { CustomerBoxRepo } from 'src/repositories/teatisDB/customerRepo/customerBox.repository';
import { TeatisJobs } from 'src/repositories/teatisJobs/dbMigrationjob';
import { GetPrePurchaseOptionsUsecase } from '@Usecases/prePurchaseSurvey/getPrePurchaseOptions.usecase';
import { PostPrePurchaseSurveyUsecase } from '../../usecases/prePurchaseSurvey/postPrePurchaseSurvey.usecase';
import { UpdateCustomerOrderUsecase } from '../../usecases/customerOrderCreate/updateCustomerOrder.usecase';
import { DeleteCustomerBoxUsecase } from '../../usecases/customerBoxUpdate/deleteCustomerBox.usecase';
import { OrderQueueRepo } from '../../repositories/teatisDB/orderRepo/orderQueue.repository';
import { GetNextBoxUsecase } from '../../usecases/nextBoxSurvey/getNextBoxSurvey.usecase';
import { CustomerNextBoxSurveyRepo } from '../../repositories/teatisDB/customerRepo/customerNextBoxSurvey.repository';
import { AnalyzePreferenceRepo } from '../../repositories/dataAnalyze/dataAnalyzeRepo';

@Module({
  controllers: [DiscoveriesController],
  providers: [
    {
      provide: 'AnalyzePreferenceRepoInterface',
      useClass: AnalyzePreferenceRepo,
    },
    {
      provide: 'CustomerNextBoxSurveyRepoInterface',
      useClass: CustomerNextBoxSurveyRepo,
    },
    {
      provide: 'GetNextBoxUsecaseInterface',
      useClass: GetNextBoxUsecase,
    },
    {
      provide: 'OrderQueueRepoInterface',
      useClass: OrderQueueRepo,
    },
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
      provide: 'CustomerBoxRepoInterface',
      useClass: CustomerBoxRepo,
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
      provide: 'GetPrePurchaseOptionsUsecaseInterface',
      useClass: GetPrePurchaseOptionsUsecase,
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
    {
      provide: 'PostPrePurchaseSurveyUsecaseInterface',
      useClass: PostPrePurchaseSurveyUsecase,
    },
    {
      provide: 'UpdateCustomerOrderUsecaseInterface',
      useClass: UpdateCustomerOrderUsecase,
    },
    {
      provide: 'DeleteCustomerBoxUsecaseInterface',
      useClass: DeleteCustomerBoxUsecase,
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
