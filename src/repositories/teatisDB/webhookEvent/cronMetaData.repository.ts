import { Inject, Injectable } from '@nestjs/common';

import { PrismaService } from '../../../prisma.service';
import { CronMetadata, Prisma, PrismaClient } from '@prisma/client';
import { WEBHOOK_EVENT_NAME } from '../../../usecases/utils/webhookEventName';
import { Transactionable } from '../../utils/transactionable.interface';

export interface GetLastRunArgs {
  name: keyof WEBHOOK_EVENT_NAME;
}

export interface UpdateLastRunArgs {
  date: Date;
  name: keyof WEBHOOK_EVENT_NAME;
}

export interface CronMetaDataRepositoryInterface extends Transactionable{
  getLastRun({ name }: GetLastRunArgs): Promise<CronMetadata>;
  updateLastRun({ date, name }:UpdateLastRunArgs): Promise<CronMetadata>;
}

@Injectable()
export class CronMetaDataRepository implements CronMetaDataRepositoryInterface {
  private originalPrismaClient : PrismaClient;
  constructor(@Inject(PrismaService) private prisma: PrismaClient | Prisma.TransactionClient) {}
  setPrismaClient(prisma: Prisma.TransactionClient): CronMetaDataRepositoryInterface {
    this.originalPrismaClient = this.prisma as PrismaClient;
    this.prisma = prisma;
    return this;
  }

  setDefaultPrismaClient() {
    this.prisma = this.originalPrismaClient;
  }

  async getLastRun({ name }: GetLastRunArgs): Promise<CronMetadata> {
    let response = await this.prisma.cronMetadata.findUnique({ where: { name } });
    if(!response){
      response = await this.prisma.cronMetadata.create(
        { data: { name, lastRunAt: new Date() } });
    }
    return response;
  }

  async updateLastRun({ date, name }: UpdateLastRunArgs): Promise<CronMetadata> {
    return await this.prisma.cronMetadata.update({ where: { name }, data: { lastRunAt: date } });
  }
}
