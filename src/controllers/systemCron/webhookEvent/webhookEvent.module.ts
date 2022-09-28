import { Module } from '@nestjs/common';
import { WebhookEventController } from './webhookEvent.controller';

@Module({
  controllers: [WebhookEventController],
  exports: [WebhookEventController],
  providers: [WebhookEventController],
})
export class WebhookEventModule {}
