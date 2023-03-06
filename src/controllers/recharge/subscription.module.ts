import { Module } from '@nestjs/common';

import { PrismaService } from '../../prisma.service';
import { CancelSubscriptionUsecase } from '../../usecases/recharge/cancelSubscription.usecase';
import { SubscriptionController } from './subscription.controller';

@Module({
  controllers: [SubscriptionController], exports: [SubscriptionController],
  providers: [
    {
      provide: 'CancelSubscriptionUsecaseInterface',
      useClass: CancelSubscriptionUsecase,
    },

    SubscriptionController,
    PrismaService,
  ],
})
export class SubscriptionModule {}
