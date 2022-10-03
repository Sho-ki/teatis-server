import { Test, TestingModule } from '@nestjs/testing';
import { Status } from '@Domains/Status';
import { ReturnValueType } from '../../../filter/customError';
import { CheckUpdateOrderUsecaseInterface } from '@Usecases/webhookEvent/checkUpdateOrder.usecase';
import { WebhookEventController } from './webhookEvent.controller';

describe('WebhookEventController', () => {
  let controller: WebhookEventController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WebhookEventController],
      providers: [
        {
          provide: 'CheckUpdateOrderUsecaseInterface',
          useValue: {
            checkUpdateOrder: () =>
              Promise.resolve<ReturnValueType<Status>>([{ success: true }]),
          } as CheckUpdateOrderUsecaseInterface,
        },
      ],
    }).compile();

    controller = module.get<WebhookEventController>(WebhookEventController);
  });

  it('should be defined', async () => {
    expect(controller).toBeDefined();
  });
});
