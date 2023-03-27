import { Inject, Injectable } from '@nestjs/common';
import { CustomerTwilioMessage, Prisma, PrismaClient } from '@prisma/client';
import { ReturnValueType } from '../../../filter/customError';
import { PrismaService } from '../../../prisma.service';
import { Transactionable } from '../../utils/transactionable.interface';

interface FindMessageByMessageIdArgs {
    messageId: string;
}
interface CreateMessageArgs {
    customerId: number;
    messageId: string;
    sentAt: Date;
}
export interface CustomerTwilioMessageRepositoryInterface extends Transactionable {
  findMessageByMessageId({ messageId }: FindMessageByMessageIdArgs): Promise<ReturnValueType<CustomerTwilioMessage>>;
  createMessage({ customerId, messageId, sentAt }:CreateMessageArgs): Promise<ReturnValueType<CustomerTwilioMessage>>;
}

@Injectable()
export class CustomerTwilioMessageRepository implements CustomerTwilioMessageRepositoryInterface {
  private originalPrismaClient : PrismaClient;
  constructor(@Inject(PrismaService) private prisma: PrismaClient | Prisma.TransactionClient) {}
  setPrismaClient(prisma: Prisma.TransactionClient): CustomerTwilioMessageRepositoryInterface {
    this.originalPrismaClient = this.prisma as PrismaClient;
    this.prisma = prisma;

    return this;
  }

  setDefaultPrismaClient() {
    this.prisma = this.originalPrismaClient;
  }

  async findMessageByMessageId({ messageId }: FindMessageByMessageIdArgs):
  Promise<ReturnValueType<CustomerTwilioMessage>> {
    const response = await this.prisma.customerTwilioMessage.findUnique({ where: { messageId } });
    return [response];
  }

  async createMessage({ customerId, messageId, sentAt }: CreateMessageArgs):
  Promise<ReturnValueType<CustomerTwilioMessage>> {
    const response = await this.prisma.customerTwilioMessage.create({ data: { customerId, messageId, sentAt } });
    return [response];
  }
}
