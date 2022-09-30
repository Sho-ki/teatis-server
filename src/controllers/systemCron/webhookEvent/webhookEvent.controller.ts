import { Controller, Post } from '@nestjs/common';

@Controller('api/system')
export class WebhookEventController {
  constructor(
  ) {}
  @Post('webhook-event')
  async checkUpdateOrderWebhook() {
  }
}
