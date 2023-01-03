import { Injectable } from '@nestjs/common';

import { PrismaService } from '../../../prisma.service';
import { ReturnValueType } from '@Filters/customError';
import { CoachedCustomer } from '@Domains/CoachedCustomer';
import { Coach } from '@Domains/Coach';

export interface GetCoachedCustomersArgs {
  email: string;
  oldCursorId?:number;
}

export interface ConnectCustomerCoachArgs {
  customerId: number;
  coachEmail:string;
}

export interface GetCustomerDetailArgs {
  id:number;
}

interface GetActiveCoachedCustomersBySendAtArgs {
 sendAt: 'at0'| 'at3'| 'at6'| 'at9'| 'at12'| 'at15'| 'at18'| 'at21';
}

export interface CoachRepositoryInterface {
  getCoachedCustomers({ email, oldCursorId }: GetCoachedCustomersArgs): Promise<ReturnValueType<CoachedCustomer[]>>;
  getCustomerDetail({ id }: GetCustomerDetailArgs): Promise<ReturnValueType<CoachedCustomer>>;

  connectCustomerCoach({ coachEmail, customerId }:ConnectCustomerCoachArgs):
  Promise<ReturnValueType<Coach>>;

  getActiveCoachedCustomersBySendAt(
    { sendAt }: GetActiveCoachedCustomersBySendAtArgs): Promise<CoachedCustomer[]>;
}

@Injectable()
export class CoachRepository implements CoachRepositoryInterface {
  constructor(private prisma: PrismaService) {}

  async getActiveCoachedCustomersBySendAt(
    { sendAt }: GetActiveCoachedCustomersBySendAtArgs): Promise<CoachedCustomer[]> {
    const response = await this.prisma.customers.findMany(
      { where: { coachingSubscribed: 'active', messageTimePreference: sendAt, coachId: { not: null } }, include: { coach: true } });

    // eslint-disable-next-line no-console
    console.log(response);
    const customers :CoachedCustomer[] =  response.length ?
      response.map((
        {
          id, email, uuid, createdAt, updatedAt, note, firstName, middleName, lastName, phone, coach,
          coachingSubscribed, boxSubscribed, sequenceBasedAutoMessageInterval, twilioChannelSid,
        }) => {
        return {
          id, email, uuid, createAt: createdAt, updatedAt, note, firstName, middleName, lastName, phone,
          coachingStatus: coachingSubscribed, boxStatus: boxSubscribed, sequenceBasedAutoMessageInterval,
          twilioChannelSid,
          coach: { id: coach.id, email: coach.email, phone: coach.phone },
        };
      })
      :[];
    return customers;
  }

  async getCustomerDetail({ id }: GetCustomerDetailArgs): Promise<ReturnValueType<CoachedCustomer>> {
    const response = await this.prisma.customers.findUnique({
      where: { id },
      include: { coach: true },
    });
    if (!response) {
      return [undefined, { name: 'Internal Server Error', message: 'id is invalid' }];
    }

    const {
      email, uuid, createdAt, updatedAt, note, firstName, middleName, lastName, phone, coach,
      boxSubscribed, coachingSubscribed,
    } = response;
    const customerDetails: CoachedCustomer =  {
      id, email, uuid, createAt: createdAt, updatedAt, note, firstName, middleName, lastName, phone,
      coachingStatus: coachingSubscribed, boxStatus: boxSubscribed,
      coach: { id: coach.id, email: coach.email, phone: coach.phone },
    };

    return [customerDetails];
  }

  async connectCustomerCoach({ coachEmail, customerId }: ConnectCustomerCoachArgs)
  : Promise<ReturnValueType<Coach>> {
    const response = await this.prisma.customers.update(
      {
        where: { id: customerId  },
        data: { coach: { connect: {  email: coachEmail || 'coach@teatismeal.com' } } },
        include: { coach: true },
      },);

    const { coachId, id } = response;
    if(!coachId || !id){
      return [undefined, { name: 'connectCustomerCoach failed', message: 'Either customerId or coachEmail is invalid' }];
    }
    await this.prisma.customerCoachHistory.upsert(
      {
        where: { customerId_coachId: { coachId: response.coachId, customerId: response.id }  },
        create: { coachId: response.coachId, customerId: response.id },
        update: {},
      },);

    return [{ id: response.coachId, email: response.coach.email }];
  }

  async getCoachedCustomers({ email, oldCursorId }: GetCoachedCustomersArgs):
  Promise<ReturnValueType<CoachedCustomer[]>> {
    const skipCount = oldCursorId?1:0;
    const cursor = oldCursorId? { id: oldCursorId }:undefined;

    const response = await this.prisma.customers.findMany({
      where: { coach: { email } },
      take: 30, skip: skipCount, cursor,
      orderBy: { id: 'asc' },
      include: { coach: true },
    });
    if (!response) {
      return [undefined, { name: 'Internal Server Error', message: 'email is invalid' }];
    }

    const coachedCustomers: CoachedCustomer[] =
    response.length ?
      response.map((
        {
          id, email, uuid, createdAt, updatedAt, note, firstName, middleName, lastName, phone, coach,
          coachingSubscribed, boxSubscribed,
        }) => {
        return {
          id, email, uuid, createAt: createdAt, updatedAt, note, firstName, middleName, lastName, phone,
          coachingStatus: coachingSubscribed, boxStatus: boxSubscribed,
          coach: { id: coach.id, email: coach.email, phone: coach.phone },
        };
      }):[];

    return [coachedCustomers];
  }
}
