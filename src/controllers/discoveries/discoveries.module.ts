import { Module } from '@nestjs/common';
import { DiscoveriesController } from './discoveries.controller';
import { GetPrePurchaseOptionsUsecase } from '@Usecases/prePurchaseSurvey/getPrePurchaseOptions.usecase';
import { GetNextBoxUsecase } from '@Usecases/nextBox/getNextBox.usecase';
import { GetSuggestion } from '@Usecases/utils/getSuggestion';
import { PractitionerBoxModule } from './practitionerBox/practitionerBox.module';
import { PractitionerModule } from './practitioner/practitioner.module';
import { EmailModule } from './email/email.module';
import { TemporaryPrePurchaseSurveysModule } from './temporaryPrePurchaseSurvey/temporaryPrePurchaseSurvey.module';
import { PostPurchaseSurveyModule } from './postPurchaseSurvey/postPurchaseSurvey.module';
import { WeeklyCheckInModule } from './weeklyCheckIn/weeklyCheckIn.module';
import { PrePurchaseSurveyModule } from './prePurchaseSurvey/prePurchaseSurvey.module';
import { CartModule } from './cart/cart.module';

@Module({
  controllers: [DiscoveriesController],
  providers: [

    {
      provide: 'GetSuggestionInterface',
      useClass: GetSuggestion,
    },
    {
      provide: 'GetNextBoxUsecaseInterface',
      useClass: GetNextBoxUsecase,
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
    CartModule,
  ],
  exports: [DiscoveriesController],
})
export class DiscoveriesModule {}
