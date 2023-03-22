import { Module } from '@nestjs/common';

import { PrismaService } from '../../../prisma.service';
import { ShopifyRepository } from '../../../repositories/shopify/shopify.repository';
import { CancelSubscriptionUsecase } from '../../../usecases/recharge/cancelSubscription.usecase';
import { OnMessageAddedUsecase } from '../../../usecases/twilio/onMessageAdded.usecase';
import { TwilioWebhookController } from './webhook.controller';

@Module({
  controllers: [TwilioWebhookController], exports: [TwilioWebhookController],
  providers: [
    {
      provide: 'OnMessageAddedUsecaseInterface',
      useClass: OnMessageAddedUsecase,
    },
    {
      provide: 'CancelSubscriptionUsecaseInterface',
      useClass: CancelSubscriptionUsecase,
    },

    {
      provide: 'ShopifyRepositoryInterface',
      useClass: ShopifyRepository,
    },
    TwilioWebhookController,
    PrismaService,
  ],
})
export class TwilioWebhookModule {}
