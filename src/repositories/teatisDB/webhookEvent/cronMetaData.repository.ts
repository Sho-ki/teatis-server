import { Injectable } from '@nestjs/common';

import { PrismaService } from '../../../prisma.service';
import { ReturnValueType } from '@Filters/customError';
import { CronMetaData } from '@Domains/CronMetaData';
import { SHOPIFY_WEBHOOK_EVENT_NAME } from '../../../usecases/utils/webhookEventName';

export interface GetLastRunArgs {
  name: string;
}

export interface UpdateLastRunArgs {
  date: Date;
  name: string;
}

export interface CronMetaDataRepositoryInterface {
  getLastRun({ name }: GetLastRunArgs): Promise<ReturnValueType<CronMetaData>>;
  updateLastRun({ date, name }:UpdateLastRunArgs): Promise<ReturnValueType<CronMetaData>>;
}

@Injectable()
export class CronMetaDataRepository implements CronMetaDataRepositoryInterface {
  constructor(private prisma: PrismaService) {}

  async getLastRun({ name }: GetLastRunArgs): Promise<ReturnValueType<CronMetaData>> {
    let response = await this.prisma.cronMetadata.findUnique({ where: { name } });
    if(!response){
      response =   await this.prisma.cronMetadata.create(
        { data: { name: SHOPIFY_WEBHOOK_EVENT_NAME.updateOrder, lastRunAt: new Date() } });
    }
    return [{ name: response.name, lastRunAt: response.lastRunAt }];
  }

  async updateLastRun({ date, name }: UpdateLastRunArgs): Promise<ReturnValueType<CronMetaData>> {
    const response = await this.prisma.cronMetadata.update({ where: { name }, data: { lastRunAt: date } });
    return [{ name: response.name, lastRunAt: response.lastRunAt }];
  }
}
