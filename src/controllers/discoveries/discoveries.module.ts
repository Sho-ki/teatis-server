import { Module } from '@nestjs/common';
import { DiscoveriesController } from './discoveries.controller';
import { ShopifyRepository } from '@Repositories/shopify/shopify.repository';
import { PrismaService } from 'src/prisma.service';
import { CustomerPrePurchaseSurveyRepository } from '@Repositories/teatisDB/customer/customerPrePurchaseSurvey.repository';
import { GetPostPurchaseSurveyUsecase } from '@Usecases/postPurcahseSurvey/getPostPurchaseSurvey.usecase';
import { QuestionPostPurchaseSurveyRepository } from '@Repositories/teatisDB/question/questionPostPurchaseSurvey.repository';
import { CustomerPostPurchaseSurveyRepository } from '@Repositories/teatisDB/customer/customerPostPurchaseSurvey.repository';
import { PostPostPurchaseSurveyUsecase } from '@Usecases/postPurcahseSurvey/postPostPurchaseSurvey.usecase';
import { ProductGeneralRepository } from '@Repositories/teatisDB/product/productGeneral.repository';
import { ShipheroRepository } from '@Repositories/shiphero/shiphero.repository';
import { UpdateCustomerBoxUsecase } from '@Usecases/customerBox/updateCustomerBox.usecase';
import { CustomerGeneralRepository } from '@Repositories/teatisDB/customer/customerGeneral.repository';
import { CustomerBoxRepository } from '@Repositories/teatisDB/customer/customerBox.repository';
import { TeatisJobs } from '@Repositories/teatisJobs/dbMigrationjob';
import { GetPrePurchaseOptionsUsecase } from '@Usecases/prePurchaseSurvey/getPrePurchaseOptions.usecase';
import { PostPrePurchaseSurveyUsecase } from '@Usecases/prePurchaseSurvey/postPrePurchaseSurvey.usecase';
import { UpdateCustomerOrderOfCustomerBoxUsecase } from '@Usecases/customerOrder/updateCustomerOrderOfCustomerBox.usecase';
import { DeleteCustomerBoxUsecase } from '@Usecases/customerBox/deleteCustomerBox.usecase';
import { OrderQueueRepository } from '@Repositories/teatisDB/order/orderQueue.repository';
import { GetNextBoxUsecase } from '@Usecases/nextBox/getNextBox.usecase';
import { CustomerPreferenceRepository } from '@Repositories/teatisDB/customer/customerPreference.repository';
import { AnalyzePreferenceRepository } from '@Repositories/dataAnalyze/dataAnalyze.respository';
import { GetSuggestion } from '@Usecases/utils/getSuggestion';
import { GetCustomerNutritionUsecase } from '@Usecases/customerNutrition/getCustomerNutrition.usecase';
import { CreateCustomerUsecase } from '@Usecases/utils/createCustomer';
import { CreateCheckoutCartOfPractitionerBoxOldUsecase } from '@Usecases/checkoutCart/createCheckoutCartOfPractitionerBoxOld.usecase';
import { PractitionerBoxModule } from './practitioner-box/practitionerBox.module';
import { PractitionerModule } from './practitioner/practitioner.module';
import { UpdateCustomerOrderOfPractitionerBoxUsecase } from '@Usecases/customerOrder/updateCustomerOrderOfPractitionerBox.usecase';
import { PractitionerBoxRepository } from '@Repositories/teatisDB/practitioner/practitionerBox.repo';
import { PractitionerBoxOrderHistoryRepository } from '@Repositories/teatisDB/practitioner/practitionerBoxOrderHistory.repository';
import { UpdatePractitionerBoxOrderHistoryUsecase } from '@Usecases/practitionerBoxOrder/updatePractitionerBoxOrderHistory.usecase';
import { GetFirstBoxUsecase } from '@Usecases/firstBox/getFirstBox.usecase';
import { CreateCheckoutCartOfPractitionerMealBoxUsecase } from '@Usecases/checkoutCart/createCheckoutCartOfPractitionerMealBox.usecase';
import { KlaviyoRepository } from '@Repositories/klaviyo/klaviyo.repository';
import { PostEmailUsecase } from '@Usecases/email/postCustomerEmail';
import { EmailModule } from './email/email.module';
import { CreateCheckoutCartOfCustomerBoxUsecase } from '../../usecases/checkoutCart/createCheckoutCartOfCustomerBox.usecase';
import { CreateCheckoutCartOfPractitionerBoxUsecase } from '../../usecases/checkoutCart/createCheckoutCartOfPractitionerBox.usecase';
import { CustomerProductsAutoSwap } from '../../usecases/utils/customerProductsAutoSwap';
import { WebhookEventRepository } from '@Repositories/teatisDB/webhookEvent/webhookEvent.repository';

@Module({
  controllers: [DiscoveriesController],
  providers: [
    {
      provide: 'WebhookEventRepositoryInterface',
      useClass: WebhookEventRepository,
    },
    {
      provide: 'CustomerProductsAutoSwapInterface',
      useClass: CustomerProductsAutoSwap,
    },
    {
      provide: 'CreateCheckoutCartOfPractitionerBoxUsecaseInterface',
      useClass: CreateCheckoutCartOfPractitionerBoxUsecase,
    },
    {
      provide: 'CreateCheckoutCartOfPractitionerMealBoxUsecaseInterface',
      useClass: CreateCheckoutCartOfPractitionerMealBoxUsecase,
    },
    {
      provide: 'GetFirstBoxUsecaseInterface',
      useClass: GetFirstBoxUsecase,
    },
    {
      provide: 'UpdatePractitionerBoxOrderHistoryUsecaseInterface',
      useClass: UpdatePractitionerBoxOrderHistoryUsecase,
    },
    {
      provide: 'PractitionerBoxOrderHistoryRepositoryInterface',
      useClass: PractitionerBoxOrderHistoryRepository,
    },
    {
      provide: 'CreateCheckoutCartOfPractitionerBoxOldUsecaseInterface',
      useClass: CreateCheckoutCartOfPractitionerBoxOldUsecase,
    },
    {
      provide: 'PractitionerBoxRepositoryInterface',
      useClass: PractitionerBoxRepository,
    },
    {
      provide: 'UpdateCustomerOrderOfPractitionerBoxUsecaseInterface',
      useClass: UpdateCustomerOrderOfPractitionerBoxUsecase,
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
      provide: 'CreateCheckoutCartOfCustomerBoxUsecaseInterface',
      useClass: CreateCheckoutCartOfCustomerBoxUsecase,
    },
    {
      provide: 'GetSuggestionInterface',
      useClass: GetSuggestion,
    },
    {
      provide: 'AnalyzePreferenceRepositoryInterface',
      useClass: AnalyzePreferenceRepository,
    },
    {
      provide: 'CustomerPreferenceRepositoryInterface',
      useClass: CustomerPreferenceRepository,
    },
    {
      provide: 'GetNextBoxUsecaseInterface',
      useClass: GetNextBoxUsecase,
    },
    {
      provide: 'OrderQueueRepositoryInterface',
      useClass: OrderQueueRepository,
    },
    {
      provide: 'CustomerPrePurchaseSurveyRepositoryInterface',
      useClass: CustomerPrePurchaseSurveyRepository,
    },
    {
      provide: 'CustomerPostPurchaseSurveyRepositoryInterface',
      useClass: CustomerPostPurchaseSurveyRepository,
    },
    {
      provide: 'CustomerGeneralRepositoryInterface',
      useClass: CustomerGeneralRepository,
    },
    {
      provide: 'CustomerBoxRepositoryInterface',
      useClass: CustomerBoxRepository,
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
      provide: 'QuestionPostPurchaseSurveyRepositoryInterface',
      useClass: QuestionPostPurchaseSurveyRepository,
    },
    {
      provide: 'ShopifyRepositoryInterface',
      useClass: ShopifyRepository,
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
      provide: 'UpdateCustomerOrderOfCustomerBoxUsecaseInterface',
      useClass: UpdateCustomerOrderOfCustomerBoxUsecase,
    },
    {
      provide: 'DeleteCustomerBoxUsecaseInterface',
      useClass: DeleteCustomerBoxUsecase,
    },
    {
      provide: 'PostEmailUsecaseInterface',
      useClass: PostEmailUsecase,
    },
    {
      provide: 'KlaviyoRepositoryInterface',
      useClass: KlaviyoRepository,
    },
    TeatisJobs,
    DiscoveriesController,
    PrismaService,
  ],
  imports: [PractitionerModule, PractitionerBoxModule, EmailModule],
  exports: [DiscoveriesController],
})
export class DiscoveriesModule {}
