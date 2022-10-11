import { Injectable } from '@nestjs/common';

import { PrismaService } from '../../../prisma.service';
import { ReturnValueType } from '@Filters/customError';
import { Status } from '@Domains/Status';
import { ShopifyWebhookApiId } from '@Domains/ShopifyWebhookApiId';
import { SHOPIFY_WEBHOOK_EVENT_NAME } from '../../../usecases/utils/webhookEventName';

export interface PostApiIdArgs {
  apiId: string;
}
export interface GetApiIdsArgs {
  fromDate: Date;
}

export interface WebhookEventRepositoryInterface {
  postApiId({ apiId }: PostApiIdArgs): Promise<ReturnValueType<Status>>;
  getApiIds({ fromDate }: GetApiIdsArgs): Promise<ReturnValueType<ShopifyWebhookApiId[]>>;
}

@Injectable()
export class WebhookEventRepository implements WebhookEventRepositoryInterface {
  constructor(private prisma: PrismaService) {}

  async postApiId({ apiId }: PostApiIdArgs): Promise<ReturnValueType<Status>> {
    await this.prisma.webhookEvents.upsert({
      where: { WebhookIdentifier: { apiId, cronMetadataName: SHOPIFY_WEBHOOK_EVENT_NAME.updateOrder  } },
      create: {
        apiId, cronMetadata: {
          connectOrCreate: {
            where: { name: SHOPIFY_WEBHOOK_EVENT_NAME.updateOrder },
            create: { name: SHOPIFY_WEBHOOK_EVENT_NAME.updateOrder, lastRunAt: new Date() },
          },
        },
      },
      update: {},
    });

    return [{ success: true }];
  }

  async getApiIds({ fromDate }: GetApiIdsArgs): Promise<ReturnValueType<ShopifyWebhookApiId[]>>{
    const response = await this.prisma.webhookEvents.findMany({ where: { createdAt: { gte: fromDate } } });

    const shopifyWebhookApiIds: ShopifyWebhookApiId[] =
    response.length? response.map(({ apiId }) => { return { apiId }; }):[];
    return [shopifyWebhookApiIds];
  }
}
