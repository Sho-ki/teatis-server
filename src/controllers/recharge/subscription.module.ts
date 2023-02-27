import { Module } from '@nestjs/common';

import { PrismaService } from '../../prisma.service';
import { ShopifyRepository } from '../../repositories/shopify/shopify.repository';
import { CustomerGeneralRepository } from '../../repositories/teatisDB/customer/customerGeneral.repository';
import { CancelSubscriptionUsecase } from '../../usecases/recharge/cancelSubscription.usecase';
import { SubscriptionController } from './subscription.controller';

@Module({
  controllers: [SubscriptionController], exports: [SubscriptionController],
  providers: [
    {
      provide: 'CancelSubscriptionUsecaseInterface',
      useClass: CancelSubscriptionUsecase,
    },

    {
      provide: 'ShopifyRepositoryInterface',
      useClass: ShopifyRepository,
    },
    SubscriptionController,
    PrismaService,
  ],
})
export class SubscriptionModule {}
