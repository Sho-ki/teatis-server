import { Global, Module } from '@nestjs/common';
import { DiscoveriesController } from './discoveries.controller';
import { ShopifyRepository } from '@Repositories/shopify/shopify.repository';
import { PrismaService } from 'src/prisma.service';
import { CustomerSurveyResponseRepository } from '@Repositories/teatisDB/customer/customerSurveyResponse.repository';
import { PostPostPurchaseSurveyUsecase } from '@Usecases/postPurcahseSurvey/postPostPurchaseSurvey.usecase';
import { ProductGeneralRepository } from '@Repositories/teatisDB/product/productGeneral.repository';
import { ShipheroRepository } from '@Repositories/shiphero/shiphero.repository';
import { UpdateCustomerBoxUsecase } from '@Usecases/customerBox/updateCustomerBox.usecase';
import { CustomerGeneralRepository } from '@Repositories/teatisDB/customer/customerGeneral.repository';
import { CustomerBoxRepository } from '@Repositories/teatisDB/customer/customerBox.repository';
import { TeatisJobs } from '@Repositories/teatisJobs/dbMigrationjob';
import { GetPrePurchaseOptionsUsecase } from '@Usecases/prePurchaseSurvey/getPrePurchaseOptions.usecase';
import { PostPrePurchaseSurveyUsecase } from '@Usecases/prePurchaseSurvey/postPrePurchaseSurvey.usecase';
import { DeleteCustomerBoxUsecase } from '@Usecases/customerBox/deleteCustomerBox.usecase';
import { OrderQueueRepository } from '@Repositories/teatisDB/order/orderQueue.repository';
import { GetNextBoxUsecase } from '@Usecases/nextBox/getNextBox.usecase';
import { CustomerPreferenceRepository } from '@Repositories/teatisDB/customer/customerPreference.repository';
import { AnalyzePreferenceRepository } from '@Repositories/dataAnalyze/dataAnalyze.respository';
import { GetSuggestion } from '@Usecases/utils/getSuggestion';
import { GetCustomerNutritionUsecase } from '@Usecases/customerNutrition/getCustomerNutrition.usecase';
import { PractitionerBoxModule } from './practitioner-box/practitionerBox.module';
import { PractitionerModule } from './practitioner/practitioner.module';
import { PractitionerBoxRepository } from '@Repositories/teatisDB/practitioner/practitionerBox.repository';
import { PractitionerBoxOrderHistoryRepository } from '@Repositories/teatisDB/practitioner/practitionerBoxOrderHistory.repository';
import { GetFirstBoxUsecase } from '@Usecases/firstBox/getFirstBox.usecase';
import { KlaviyoRepository } from '@Repositories/klaviyo/klaviyo.repository';
import { PostEmailUsecase } from '@Usecases/email/postCustomerEmail';
import { EmailModule } from './email/email.module';
import { CustomerProductsAutoSwap } from '@Usecases/utils/customerProductsAutoSwap';
import { WebhookEventRepository } from '@Repositories/teatisDB/webhookEvent/webhookEvent.repository';
import { CustomerSessionRepository } from '@Repositories/teatisDB/customer/customerSession.repository';
import { CustomerAuthRepository } from '@Repositories/teatisDB/customer/customerAuth.repository';
import { CreateCalendarEvent } from '@Usecases/utils/createCalendarEvent';
import { GoogleCalendarRepository } from '@Repositories/googleOAuth2/googleCalendar.repository';
import { TemporaryPrePurchaseSurveysModule } from './temporaryPrePurchaseSurvey/temporaryPrePurchaseSurvey.module';
import { CoachRepository } from '../../repositories/teatisDB/coach/coach.repository';
import { CreateCheckoutCartUsecase } from '../../usecases/checkoutCart/createCheckoutCart.usecase';
import { UpdatePractitionerBoxOrderHistoryUsecase } from '../../usecases/practitionerBoxOrder/updatePractitionerBoxOrderHistory.usecase';
import { CustomerEventLogRepository } from '../../repositories/teatisDB/customerEventLog/customerEventLog.repository';
import { PrePurchaseSurveyModule } from './pre-purchase/prePurchaseSurvey.module';
import { SurveyQuestionsRepository } from '../../repositories/teatisDB/survey/surveyQuestions.repository';
import { WeeklyCheckInModule } from './weeklyCheckIn/weeklyCheckIn.module';

@Global()
@Module({
  controllers: [DiscoveriesController],
  providers: [
    {
      provide: 'SurveyQuestionsRepositoryInterface',
      useClass: SurveyQuestionsRepository,
    },
    {
      provide: 'CustomerEventLogRepositoryInterface',
      useClass: CustomerEventLogRepository,
    },
    {
      provide: 'CoachRepositoryInterface',
      useClass: CoachRepository,
    },
    {
      provide: 'GoogleCalendarRepositoryInterface',
      useClass: GoogleCalendarRepository,
    },
    {
      provide: 'CreateCalendarEventInterface',
      useClass: CreateCalendarEvent,
    },
    {
      provide: 'CustomerAuthRepositoryInterface',
      useClass: CustomerAuthRepository,
    },
    {
      provide: 'CustomerSessionRepositoryInterface',
      useClass: CustomerSessionRepository,
    },
    {
      provide: 'WebhookEventRepositoryInterface',
      useClass: WebhookEventRepository,
    },
    {
      provide: 'CustomerProductsAutoSwapInterface',
      useClass: CustomerProductsAutoSwap,
    },
    {
      provide: 'CreateCheckoutCartUsecaseInterface',
      useClass: CreateCheckoutCartUsecase,
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
      provide: 'PractitionerBoxRepositoryInterface',
      useClass: PractitionerBoxRepository,
    },
    {
      provide: 'GetCustomerNutritionUsecaseInterface',
      useClass: GetCustomerNutritionUsecase,
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
      provide: 'CustomerSurveyResponseRepositoryInterface',
      useClass: CustomerSurveyResponseRepository,
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

    // {
    //   provide: 'QuestionPostPurchaseSurveyRepositoryInterface',
    //   useClass: QuestionPostPurchaseSurveyRepository,
    // },
    {
      provide: 'ShopifyRepositoryInterface',
      useClass: ShopifyRepository,
    },
    {
      provide: 'GetPrePurchaseOptionsUsecaseInterface',
      useClass: GetPrePurchaseOptionsUsecase,
    },

    // {
    //   provide: 'GetPostPurchaseSurveyUsecaseInterface',
    //   useClass: GetPostPurchaseSurveyUsecase,
    // },
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
  imports: [
    PractitionerModule,
    PractitionerBoxModule,
    EmailModule,
    TemporaryPrePurchaseSurveysModule,
    PrePurchaseSurveyModule,
    WeeklyCheckInModule,
  ],
  exports: [DiscoveriesController],
})
export class DiscoveriesModule {}
