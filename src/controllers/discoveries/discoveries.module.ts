import { Module } from '@nestjs/common';
import { DiscoveriesController } from './discoveries.controller';
import { ShopifyRepo } from '@Repositories/shopify/shopify.repository';
import { PrismaService } from 'src/prisma.service';
import { CustomerPrePurchaseSurveyRepo } from '@Repositories/teatisDB/customerRepo/customerPrePurchaseSurvey.repository';
import { GetPostPurchaseSurveyUsecase } from '@Usecases/postPurcahseSurvey/getPostPurchaseSurvey.usecase';
import { QuestionPostPurchaseSurveyRepo } from '@Repositories/teatisDB/questionRepo/questionPostPurchaseSurvey.repository';
import { CustomerPostPurchaseSurveyRepo } from '@Repositories/teatisDB/customerRepo/customerPostPurchaseSurvey.repository';
import { PostPostPurchaseSurveyUsecase } from '@Usecases/postPurcahseSurvey/postPostPurchaseSurvey.usecase';
import { ProductGeneralRepo } from '@Repositories/teatisDB/productRepo/productGeneral.repository';
import { ShipheroRepo } from '@Repositories/shiphero/shiphero.repository';
import { UpdateCustomerBoxUsecase } from '@Usecases/customerBoxUpdate/updateCustomerBox.usecase';
import { CustomerGeneralRepo } from '@Repositories/teatisDB/customerRepo/customerGeneral.repository';
import { CustomerBoxRepo } from '@Repositories/teatisDB/customerRepo/customerBox.repository';
import { TeatisJobs } from '@Repositories/teatisJobs/dbMigrationjob';
import { GetPrePurchaseOptionsUsecase } from '@Usecases/prePurchaseSurvey/getPrePurchaseOptions.usecase';
import { PostPrePurchaseSurveyUsecase } from '@Usecases/prePurchaseSurvey/postPrePurchaseSurvey.usecase';
import { UpdateCustomerOrderUsecase } from '@Usecases/customerOrderCreate/updateCustomerOrder.usecase';
import { DeleteCustomerBoxUsecase } from '@Usecases/customerBoxUpdate/deleteCustomerBox.usecase';
import { OrderQueueRepo } from '@Repositories/teatisDB/orderRepo/orderQueue.repository';
import { GetNextBoxUsecase } from '@Usecases/nextBoxSurvey/getNextBoxSurvey.usecase';
import { CustomerNextBoxSurveyRepo } from '@Repositories/teatisDB/customerRepo/customerNextBoxSurvey.repository';
import { AnalyzePreferenceRepo } from '@Repositories/dataAnalyze/dataAnalyzeRepo';
import { GetNextBox } from '@Usecases/utils/getNextBox';

@Module({
  controllers: [DiscoveriesController],
  providers: [
    {
      provide: 'GetNextBoxInterface',
      useClass: GetNextBox,
    },
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
