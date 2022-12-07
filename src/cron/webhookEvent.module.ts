import { Logger, Module } from '@nestjs/common';
import { CronMetaDataRepository } from '@Repositories/teatisDB/webhookEvent/cronMetaData.repository';
import { ShopifyRepository } from '@Repositories/shopify/shopify.repository';
import { WebhookEventService } from './webhookEvent.service';
import { WebhookEventRepository } from '@Repositories/teatisDB/webhookEvent/webhookEvent.repository';
import { CheckUpdateOrderUsecase } from '@Usecases/webhookEvent/checkUpdateOrder.usecase';
import { UpdateCustomerOrderOfPractitionerBoxUsecase } from '@Usecases/customerOrder/updateCustomerOrderOfPractitionerBox.usecase';
import { UpdateCustomerOrderOfCustomerBoxUsecase } from '@Usecases/customerOrder/updateCustomerOrderOfCustomerBox.usecase';
import { ShipheroRepository } from '@Repositories/shiphero/shiphero.repository';
import { ProductGeneralRepository } from '@Repositories/teatisDB/product/productGeneral.repository';
import { AnalyzePreferenceRepository } from '@Repositories/dataAnalyze/dataAnalyze.respository';
import { KlaviyoRepository } from '@Repositories/klaviyo/klaviyo.repository';
import { CustomerBoxRepository } from '@Repositories/teatisDB/customer/customerBox.repository';
import { CustomerGeneralRepository } from '@Repositories/teatisDB/customer/customerGeneral.repository';
import { CustomerPostPurchaseSurveyRepository } from '@Repositories/teatisDB/customer/customerPostPurchaseSurvey.repository';
import { CustomerPreferenceRepository } from '@Repositories/teatisDB/customer/customerPreference.repository';
import { CustomerPrePurchaseSurveyRepository } from '@Repositories/teatisDB/customer/customerPrePurchaseSurvey.repository';
import { OrderQueueRepository } from '@Repositories/teatisDB/order/orderQueue.repository';
import { PractitionerBoxRepository } from '@Repositories/teatisDB/practitioner/practitionerBox.repo';
import { PractitionerBoxOrderHistoryRepository } from '@Repositories/teatisDB/practitioner/practitionerBoxOrderHistory.repository';
import { CreateCheckoutCartOfCustomerBoxUsecase } from '@Usecases/checkoutCart/createCheckoutCartOfCustomerBox.usecase';
import { CreateCheckoutCartOfPractitionerBoxUsecase } from '@Usecases/checkoutCart/createCheckoutCartOfPractitionerBox.usecase';
import { CreateCustomerUsecase } from '@Usecases/utils/createCustomer';
import { CustomerProductsAutoSwap } from '@Usecases/utils/customerProductsAutoSwap';
import { GetSuggestion } from '@Usecases/utils/getSuggestion';
import { CustomerSessionRepository } from '@Repositories/teatisDB/customer/customerSession.repository';
import { CustomerAuthRepository } from '@Repositories/teatisDB/customer/customerAuth.repository';
import { CustomerCoachRepository } from '../repositories/teatisDB/coach/customerCoach.repository';
import { PrismaService } from '../prisma.service';
import { CreateCalendarEvent } from '../usecases/utils/createCalendarEvent';

@Module({
  exports: [WebhookEventService],
  providers: [
    WebhookEventService,
    {
      provide: 'CustomerCoachRepositoryInterface',
      useClass: CustomerCoachRepository,
    },
    {
      provide: 'CustomerAuthRepositoryInterface',
      useClass: CustomerAuthRepository,
    },
    {
      provide: 'CreateCalendarEventInterface',
      useClass: CreateCalendarEvent,
    },

    {
      provide: 'CustomerSessionRepositoryInterface',
      useClass: CustomerSessionRepository,
    },
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
    Logger,
  ],
})
export class WebhookEventModule {}
