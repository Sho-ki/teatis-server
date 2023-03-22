import { Inject, Injectable } from '@nestjs/common';

import { PrismaService } from '../../../prisma.service';
import { ReturnValueType } from '@Filters/customError';
import { CoachedCustomer } from '@Domains/CoachedCustomer';
import { Coach, Prisma, PrismaClient } from '@prisma/client';
import { Transactionable } from '../../utils/transactionable.interface';
// import { Coach } from '@Domains/Coach';

export interface GetCoachedCustomersArgs {
  email: string;
  oldCursorId?:number;
}

export interface ConnectCustomerCoachArgs {
  customerId: number;
  coachEmail:string;
}

export interface FindCustomerCoachArgs {
  customerId: number;
}

export interface GetCustomerDetailArgs {
  id:number;
}

export interface BulkInsertCustomerConversationSummaryArgs {
  customerId: number;
  coachId: number;
  conversationSummary: string;
}

interface GetActiveCoachedCustomersBySendAtArgs {
 sendAt: 'at0'| 'at3'| 'at6'| 'at9'| 'at12'| 'at15'| 'at18'| 'at21';
}

export interface CoachRepositoryInterface extends Transactionable{
  getCoachedCustomers({ email, oldCursorId }: GetCoachedCustomersArgs): Promise<ReturnValueType<CoachedCustomer[]>>;
  getCustomerDetail({ id }: GetCustomerDetailArgs): Promise<ReturnValueType<CoachedCustomer>>;

  connectCustomerCoach({ coachEmail, customerId }:ConnectCustomerCoachArgs):
  Promise<Coach>;

  getActiveCoachedCustomersBySendAt(
    { sendAt }: GetActiveCoachedCustomersBySendAtArgs): Promise<CoachedCustomer[]>;
  bulkInsertCustomerConversationSummary(
    args: BulkInsertCustomerConversationSummaryArgs[]
  ): Promise<ReturnValueType<Prisma.BatchPayload>>;

  // findCustomerCoach({ customerId }:FindCustomerCoachArgs):Promise<Coach> ;
}

@Injectable()
export class CoachRepository implements CoachRepositoryInterface {
  private originalPrismaClient : PrismaClient;
  constructor(@Inject(PrismaService) private prisma: PrismaClient | Prisma.TransactionClient) {}
  setPrismaClient(prisma: Prisma.TransactionClient): CoachRepositoryInterface {
    this.originalPrismaClient = this.prisma as PrismaClient;
    this.prisma = prisma;
    return this;
  }

  setDefaultPrismaClient() {
    this.prisma = this.originalPrismaClient;
  }

  async getActiveCoachedCustomersBySendAt(
    { sendAt }: GetActiveCoachedCustomersBySendAtArgs): Promise<CoachedCustomer[]> {
    const response = await this.prisma.customers.findMany(
      { where: { coachingSubscribed: 'active', messageTimePreference: sendAt, coachId: { not: null } }, include: { coach: true, customerCoachHistory: true } });

    // eslint-disable-next-line no-console
    console.log(response);
    const customers :CoachedCustomer[] =  response.length ?
      response.map((
        {
          id, email, uuid, createdAt, updatedAt, note, firstName, middleName, lastName, phone, coach,
          coachingSubscribed, boxSubscribed, sequenceBasedAutoMessageInterval, twilioChannelSid,
          customerCoachHistory,
        }) => {
        return {
          id, email, uuid, createdAt, updatedAt, note, firstName, middleName, lastName, phone,
          coachingSubscribed, boxSubscribed, sequenceBasedAutoMessageInterval,
          twilioChannelSid,
          coach: { id: coach.id, email: coach.email, phone: coach.phone },
          customerCoachHistory,
        };
      })
      :[];
    return customers;
  }

  async getCustomerDetail({ id }: GetCustomerDetailArgs): Promise<ReturnValueType<CoachedCustomer>> {
    const response = await this.prisma.customers.findUnique({
      where: { id },
      include: { coach: true, customerCoachHistory: true },
    });
    if (!response) {
      return [undefined, { name: 'Internal Server Error', message: 'id is invalid' }];
    }

    const {
      email, uuid, createdAt, updatedAt, note, firstName, middleName, lastName, phone, coach,
      boxSubscribed, coachingSubscribed, twilioChannelSid,
      customerCoachHistory,
    } = response;
    const customerDetails: CoachedCustomer =  {
      id, email, uuid, createdAt, updatedAt, note, firstName, middleName, lastName, phone,
      coachingSubscribed, boxSubscribed, twilioChannelSid,
      coach: { id: coach.id, email: coach.email, phone: coach.phone },
      customerCoachHistory,
    };

    return [customerDetails];
  }

  async connectCustomerCoach({ coachEmail, customerId }: ConnectCustomerCoachArgs)
  : Promise<Coach> {
    const response = await this.prisma.customers.update(
      {
        where: { id: customerId  },
        data: { coach: { connect: {  email: coachEmail } } },
        include: { coach: true },
      },);

    await this.prisma.customerCoachHistory.upsert(
      {
        where: { customerId_coachId: { coachId: response.coachId, customerId: response.id }  },
        create: { coachId: response.coachId, customerId: response.id },
        update: {},
      },);

    return response.coach;
  }

  // async findCustomerCoach({ customerId }: FindCustomerCoachArgs)
  // : Promise<Coach> {
  //   const response = await this.prisma.customers.findUnique(
  //     {
  //       where: { id: customerId },
  //       include: { coach: true },
  //     },);

  //   return response.coach;
  // }

  async getCoachedCustomers({ email, oldCursorId }: GetCoachedCustomersArgs):
  Promise<ReturnValueType<CoachedCustomer[]>> {
    const skipCount = oldCursorId?1:0;
    const cursor = oldCursorId? { id: oldCursorId }:undefined;

    const response = await this.prisma.customers.findMany({
      where: { coach: { email } },
      take: 30, skip: skipCount, cursor,
      orderBy: { id: 'asc' },
      include: { coach: true, customerCoachHistory: true },
    });
    if (!response) {
      return [undefined, { name: 'Internal Server Error', message: 'email is invalid' }];
    }

    const coachedCustomers: CoachedCustomer[] =
    response.length ?
      response.map((
        {
          id, email, uuid, createdAt, updatedAt, note, firstName, middleName, lastName, phone, coach,
          coachingSubscribed, boxSubscribed, customerCoachHistory,
        }) => {
        return {
          id, email, uuid, createdAt, updatedAt, note, firstName, middleName, lastName, phone,
          coachingSubscribed, boxSubscribed,
          coach: { id: coach.id, email: coach.email, phone: coach.phone },
          customerCoachHistory,
        };
      }):[];

    return [coachedCustomers];
  }
  async bulkInsertCustomerConversationSummary(
    args: BulkInsertCustomerConversationSummaryArgs[]
  ): Promise<ReturnValueType<Prisma.BatchPayload>> {
    console.log('bulkInsertCustomerConversationSummary');
    const response = await this.prisma.customerCoachHistory.createMany(
      { data: args }
    );
    return [{ count: response.count }];
  }
}
