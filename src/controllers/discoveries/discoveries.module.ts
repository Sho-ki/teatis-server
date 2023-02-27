import { Module } from '@nestjs/common';
import { DiscoveriesController } from './discoveries.controller';
import { ShopifyRepository } from '@Repositories/shopify/shopify.repository';
import { ShipheroRepository } from '@Repositories/shiphero/shiphero.repository';
import { GetPrePurchaseOptionsUsecase } from '@Usecases/prePurchaseSurvey/getPrePurchaseOptions.usecase';
import { GetNextBoxUsecase } from '@Usecases/nextBox/getNextBox.usecase';
import { CustomerPreferenceRepository } from '@Repositories/teatisDB/customer/customerPreference.repository';
import { AnalyzePreferenceRepository } from '@Repositories/dataAnalyze/dataAnalyze.respository';
import { GetSuggestion } from '@Usecases/utils/getSuggestion';
import { PractitionerBoxModule } from './practitioner-box/practitionerBox.module';
import { PractitionerModule } from './practitioner/practitioner.module';
import { EmailModule } from './email/email.module';
import { CustomerSessionRepository } from '@Repositories/teatisDB/customer/customerSession.repository';
import { TemporaryPrePurchaseSurveysModule } from './temporaryPrePurchaseSurvey/temporaryPrePurchaseSurvey.module';
import { CreateCheckoutCartUsecase } from '../../usecases/checkoutCart/createCheckoutCart.usecase';
import { PostPurchaseSurveyModule } from './postPurchaseSurvey/postPurchaseSurvey.module';
import { WeeklyCheckInModule } from './weeklyCheckIn/weeklyCheckIn.module';
import { PrePurchaseSurveyModule } from './prePurchaseSurvey/prePurchaseSurvey.module';

@Module({
  controllers: [DiscoveriesController],
  providers: [
    {
      provide: 'CustomerSessionRepositoryInterface',
      useClass: CustomerSessionRepository,
    },
    {
      provide: 'CreateCheckoutCartUsecaseInterface',
      useClass: CreateCheckoutCartUsecase,
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
      provide: 'ShipheroRepositoryInterface',
      useClass: ShipheroRepository,
    },
    {
      provide: 'ShopifyRepositoryInterface',
      useClass: ShopifyRepository,
    },
    {
      provide: 'GetPrePurchaseOptionsUsecaseInterface',
      useClass: GetPrePurchaseOptionsUsecase,
    },
    DiscoveriesController,
  ],
  imports: [
    PractitionerModule,
    PractitionerBoxModule,
    EmailModule,
    TemporaryPrePurchaseSurveysModule,
    PostPurchaseSurveyModule,
    PrePurchaseSurveyModule,
    WeeklyCheckInModule,
  ],
  exports: [DiscoveriesController],
})
export class DiscoveriesModule {}
