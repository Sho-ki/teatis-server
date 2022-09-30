import { Injectable } from '@nestjs/common';

import { PrismaService } from '../../../prisma.service';
import { ReturnValueType } from '@Filters/customError';
import { Status } from '@Domains/Status';

export interface PostApiIdArgs {
  apiId: string;
}

export interface WebhookEventRepositoryInterface {
  postUniqueApiId({ apiId }: PostApiIdArgs): Promise<ReturnValueType<Status>>;
}

@Injectable()
export class WebhookEventRepository implements WebhookEventRepositoryInterface {
  constructor(private prisma: PrismaService) {}

  async postUniqueApiId({ apiId }: PostApiIdArgs): Promise<ReturnValueType<Status>> {
    await this.prisma.shopifyEvents.upsert({
      where: { apiId },
      create: { apiId, cronMetadata: { connect: { name: 'updateOrder' } } },
      update: {},
    });

    return [{ success: true }];
  }
}
