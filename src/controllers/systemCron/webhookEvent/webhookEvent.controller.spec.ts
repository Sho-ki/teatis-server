import { Test, TestingModule } from '@nestjs/testing';
import { WebhookEventController } from './webhookEvent.controller';

describe('WebhookEventController', () => {
  let controller: WebhookEventController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({ controllers: [WebhookEventController] }).compile();

    controller = module.get<WebhookEventController>(WebhookEventController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
