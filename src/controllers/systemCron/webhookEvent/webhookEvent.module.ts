import { Module } from '@nestjs/common';
import { CronMetaDataRepository } from '@Repositories/teatisDB/webhookEvent/cronMetaData.repository';
import { ShopifyRepository } from '@Repositories/shopify/shopify.repository';
import { WebhookEventController } from './webhookEvent.controller';
import { WebhookEventRepository } from '@Repositories/teatisDB/webhookEvent/webhookEvent.repository';
import { CheckUpdateOrderUsecase } from '@Usecases/webhookEvent/checkUpdateOrder.usecase';
import { PrismaService } from '../../../prisma.service';
import { UpdateCustomerOrderOfPractitionerBoxUsecase } from '../../../usecases/customerOrder/updateCustomerOrderOfPractitionerBox.usecase';
import { UpdateCustomerOrderOfCustomerBoxUsecase } from '../../../usecases/customerOrder/updateCustomerOrderOfCustomerBox.usecase';
import { ShipheroRepository } from '../../../repositories/shiphero/shiphero.repository';
import { ProductGeneralRepository } from '../../../repositories/teatisDB/product/productGeneral.repository';
import { AnalyzePreferenceRepository } from '../../../repositories/dataAnalyze/dataAnalyze.respository';
import { KlaviyoRepository } from '../../../repositories/klaviyo/klaviyo.repository';
import { CustomerBoxRepository } from '../../../repositories/teatisDB/customer/customerBox.repository';
import { CustomerGeneralRepository } from '../../../repositories/teatisDB/customer/customerGeneral.repository';
import { CustomerPostPurchaseSurveyRepository } from '../../../repositories/teatisDB/customer/customerPostPurchaseSurvey.repository';
import { CustomerPreferenceRepository } from '../../../repositories/teatisDB/customer/customerPreference.repository';
import { CustomerPrePurchaseSurveyRepository } from '../../../repositories/teatisDB/customer/customerPrePurchaseSurvey.repository';
import { OrderQueueRepository } from '../../../repositories/teatisDB/order/orderQueue.repository';
import { PractitionerBoxRepository } from '../../../repositories/teatisDB/practitioner/practitionerBox.repo';
import { PractitionerBoxOrderHistoryRepository } from '../../../repositories/teatisDB/practitioner/practitionerBoxOrderHistory.repository';
import { CreateCheckoutCartOfCustomerBoxUsecase } from '../../../usecases/checkoutCart/createCheckoutCartOfCustomerBox.usecase';
import { CreateCheckoutCartOfPractitionerBoxUsecase } from '../../../usecases/checkoutCart/createCheckoutCartOfPractitionerBox.usecase';
import { UpdateCustomerOrderOfPractitionerMealBoxUsecase } from '../../../usecases/customerOrder/updateCustomerOrderOfPractitionerMealBox.usecase';
import { CreateCustomerUsecase } from '../../../usecases/utils/createCustomer';
import { CustomerProductsAutoSwap } from '../../../usecases/utils/customerProductsAutoSwap';
import { GetSuggestion } from '../../../usecases/utils/getSuggestion';

@Module({
  controllers: [WebhookEventController],
  exports: [WebhookEventController],
  providers: [
    WebhookEventController,
    {
      provide: 'CheckUpdateOrderUsecaseInterface',
      useClass: CheckUpdateOrderUsecase,
    },
    {
      provide: 'WebhookEventRepositoryInterface',
      useClass: WebhookEventRepository,
    },
    {
      provide: 'ShopifyRepositoryInterface',
      useClass: ShopifyRepository,
    },
    {
      provide: 'CronMetaDataRepositoryInterface',
      useClass: CronMetaDataRepository,
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
      provide: 'UpdateCustomerOrderOfPractitionerMealBoxUsecaseInterface',
      useClass: UpdateCustomerOrderOfPractitionerMealBoxUsecase,
    },

    {
      provide: 'PractitionerBoxOrderHistoryRepositoryInterface',
      useClass: PractitionerBoxOrderHistoryRepository,
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
      provide: 'UpdateCustomerOrderOfCustomerBoxUsecaseInterface',
      useClass: UpdateCustomerOrderOfCustomerBoxUsecase,
    },
    {
      provide: 'KlaviyoRepositoryInterface',
      useClass: KlaviyoRepository,
    },
    PrismaService,
  ],
})
export class WebhookEventModule {}
