import { Test, TestingModule } from '@nestjs/testing';
import { Status } from '@Domains/Status';
import { CheckUpdateOrderUsecaseInterface } from '@Usecases/webhookEvent/checkUpdateOrder.usecase';
import { WebhookEventService } from './webhookEvent.service';
import { Logger } from '@nestjs/common';
import { ReturnValueType } from '../filter/customError';

describe('WebhookEventService', () => {
  let controller: WebhookEventService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WebhookEventService],
      providers: [
        Logger,
        {
          provide: 'CheckUpdateOrderUsecaseInterface',
          useValue: {
            checkUpdateOrder: () =>
              Promise.resolve<ReturnValueType<Status>>([{ success: true }]),
          } as CheckUpdateOrderUsecaseInterface,
        },
      ],
    }).compile();

    controller = module.get<WebhookEventService>(WebhookEventService);
  });

  it('should be defined', async () => {
    expect(controller).toBeDefined();
  });
});