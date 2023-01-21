import { Inject, Injectable } from '@nestjs/common';

import { PrismaService } from '../../../prisma.service';
import { Prisma, PrismaClient, WebhookEvent } from '@prisma/client';
import { WEBHOOK_CLIENT, WEBHOOK_EVENT_NAME } from '../../../usecases/utils/webhookEventName';
import { ReturnValueType } from '../../../filter/customError';
import { Transactionable } from '../../utils/transactionable.interface';

export interface PostApiIdArgs {
  apiId: string;
  name: keyof WEBHOOK_EVENT_NAME;
  client: keyof WEBHOOK_CLIENT;
}

export interface GetApiIdsArgs {
  fromDate: Date;
  name: keyof WEBHOOK_EVENT_NAME;
  client: keyof WEBHOOK_CLIENT;
}

export interface FindApiIdArgs {
  apiId: string;
  client: keyof WEBHOOK_CLIENT;
}

export interface WebhookEventRepositoryInterface extends Transactionable{
  postApiId({ apiId, name, client }: PostApiIdArgs): Promise<ReturnValueType<WebhookEvent>>;
  getApiIds({ fromDate, name, client }: GetApiIdsArgs): Promise<WebhookEvent[]>;
}

@Injectable()
export class WebhookEventRepository implements WebhookEventRepositoryInterface {
  private originalPrismaClient : PrismaClient;
  constructor(@Inject(PrismaService) private prisma: PrismaClient | Prisma.TransactionClient) {}
  setPrismaClient(prisma: Prisma.TransactionClient): WebhookEventRepositoryInterface {
    this.originalPrismaClient = this.prisma as PrismaClient;
    this.prisma = prisma;

    return this;
  }

  setDefaultPrismaClient() {
    this.prisma = this.originalPrismaClient;
  }

  async postApiId({ apiId, name, client }: PostApiIdArgs): Promise<ReturnValueType<WebhookEvent>> {
    try{
      const response =
        await this.prisma.webhookEvent.create({
          data: {
            client,
            apiId,
            cronMetadata: {
              connectOrCreate: {
                where: { name },
                create: { name, lastRunAt: new Date() },
              },
            },
          },
        });
      return [response];

    }catch(e){
      if(e.code === 'P2002'){ // unique constraint error
        return [undefined, { name: 'postApiId failed', message: 'Prisma unique constraint' }];
      }
      throw e;
    }
  }

  async getApiIds({ fromDate, name }: GetApiIdsArgs): Promise<WebhookEvent[]>{
    return await this.prisma.webhookEvent.findMany({
      where:
      {
        createdAt: { gte: fromDate },
        cronMetadataName: name,
      },
    });
  }
}
