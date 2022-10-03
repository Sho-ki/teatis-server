import { Module } from '@nestjs/common';
import { CronMetaDataRepository } from '@Repositories/teatisDB/webhookEvent/cronMetaData.repository';
import { ShopifyRepository } from '@Repositories/shopify/shopify.repository';
import { WebhookEventController } from './webhookEvent.controller';
import { WebhookEventRepository } from '@Repositories/teatisDB/webhookEvent/webhookEvent.repository';
import { SystemRepository } from '@Repositories/system/system.repository';
import { CheckUpdateOrderUsecase } from '@Usecases/webhookEvent/checkUpdateOrder.usecase';
import { PrismaService } from '../../../prisma.service';

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
      provide: 'SystemRepositoryInterface',
      useClass: SystemRepository,
    },
    PrismaService,
  ],
})
export class WebhookEventModule {}
