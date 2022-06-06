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
import { UpdateCustomerBoxUsecase } from '@Usecases/customerBox/updateCustomerBox.usecase';
import { CustomerGeneralRepo } from '@Repositories/teatisDB/customerRepo/customerGeneral.repository';
import { CustomerBoxRepo } from '@Repositories/teatisDB/customerRepo/customerBox.repository';
import { TeatisJobs } from '@Repositories/teatisJobs/dbMigrationjob';
import { GetPrePurchaseOptionsUsecase } from '@Usecases/prePurchaseSurvey/getPrePurchaseOptions.usecase';
import { PostPrePurchaseSurveyUsecase } from '@Usecases/prePurchaseSurvey/postPrePurchaseSurvey.usecase';
import { UpdateCustomerOrderByCustomerUuidUsecase } from '@Usecases/customerOrder/updateCustomerOrderByCustomerUuid.usecase';
import { DeleteCustomerBoxUsecase } from '@Usecases/customerBox/deleteCustomerBox.usecase';
import { OrderQueueRepo } from '@Repositories/teatisDB/orderRepo/orderQueue.repository';
import { GetNextBoxUsecase } from '@Usecases/nextBoxSurvey/getNextBoxSurvey.usecase';
import { CustomerNextBoxSurveyRepo } from '@Repositories/teatisDB/customerRepo/customerNextBoxSurvey.repository';
import { AnalyzePreferenceRepo } from '@Repositories/dataAnalyze/dataAnalyzeRepo';
import { GetNextBox } from '@Usecases/utils/getNextBox';
import { GetCustomerNutritionUsecase } from '@Usecases/customerNutrition/getCustomerNutrition.usecase';
import { CreateCheckoutCartOfCustomerOriginalBoxUsecase } from '@Usecases/checkoutCart/createCheckoutCartOfCustomerOriginalBox.usecase';
import { CreateCustomerUsecase } from '@Usecases/utils/createCustomer';
import { CreateCheckoutCartOfPractitionerBoxUsecase } from '@Usecases/checkoutCart/createCheckoutCartOfPractitionerBox.usecase';
import { PractitionerBoxModule } from './practitioner-box/practitionerBox.module';
import { PractitionerModule } from './practitioner/practitioner.module';
import { UpdateCustomerOrderByPractitionerBoxUuidUsecase } from '@Usecases/customerOrder/updateCustomerOrderByPractitionerBoxUuid.usecase';
import { PractitionerBoxRepo } from '@Repositories/teatisDB/practitionerRepo/practitionerBox.repo';
import { PractitionerBoxOrderHistoryRepo } from '@Repositories/teatisDB/practitionerRepo/practitionerBoxOrderHistory.repository';
import { UpdatePractitionerBoxOrderHistoryUsecase } from '@Usecases/practitionerBoxOrder/updatePractitionerBoxOrderHistory.usecase';

@Module({
  controllers: [DiscoveriesController],
  providers: [
    {
      provide: 'UpdatePractitionerBoxOrderHistoryUsecaseInterface',
      useClass: UpdatePractitionerBoxOrderHistoryUsecase,
    },
    {
      provide: 'PractitionerBoxOrderHistoryRepoInterface',
      useClass: PractitionerBoxOrderHistoryRepo,
    },
    {
      provide: 'CreateCheckoutCartOfPractitionerBoxUsecaseInterface',
      useClass: CreateCheckoutCartOfPractitionerBoxUsecase,
    },
    {
      provide: 'PractitionerBoxRepoInterface',
      useClass: PractitionerBoxRepo,
    },
    {
      provide: 'UpdateCustomerOrderByPractitionerBoxUuidUsecaseInterface',
      useClass: UpdateCustomerOrderByPractitionerBoxUuidUsecase,
    },
    {
      provide: 'CreateCustomerUsecaseInterface',
      useClass: CreateCustomerUsecase,
    },
    {
      provide: 'GetCustomerNutritionUsecaseInterface',
      useClass: GetCustomerNutritionUsecase,
    },
    {
      provide: 'CreateCheckoutCartOfCustomerOriginalBoxUsecaseInterface',
      useClass: CreateCheckoutCartOfCustomerOriginalBoxUsecase,
    },
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
      provide: 'UpdateCustomerOrderByCustomerUuidUsecaseInterface',
      useClass: UpdateCustomerOrderByCustomerUuidUsecase,
    },
    {
      provide: 'DeleteCustomerBoxUsecaseInterface',
      useClass: DeleteCustomerBoxUsecase,
    },

    TeatisJobs,
    DiscoveriesController,
    PrismaService,
  ],
  imports: [PractitionerModule, PractitionerBoxModule],
  exports: [DiscoveriesController],
})
export class DiscoveriesModule {}
