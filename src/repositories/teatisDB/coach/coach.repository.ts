import { Injectable } from '@nestjs/common';

import { PrismaService } from '../../../prisma.service';
import { ReturnValueType } from '@Filters/customError';
import { CoachCustomer } from '@Domains/CoachCustomer';
import { Coach } from '@Domains/Coach';

export interface GetCoachCustomersArgs {
  email: string;
}

export interface ConnectCustomerCoachArgs {
  customerId: number;
  coachEmail:string;
}

export interface GetCustomerDetailArgs {
  id:number;
}

export interface CoachRepositoryInterface {
  getCoachCustomers({ email }: GetCoachCustomersArgs): Promise<ReturnValueType<CoachCustomer[]>>;
  getCustomerDetail({ id }: GetCustomerDetailArgs): Promise<ReturnValueType<CoachCustomer>>;

  connectCustomerCoach({ coachEmail, customerId }:ConnectCustomerCoachArgs):
  Promise<ReturnValueType<Coach>>;
}

@Injectable()
export class CoachRepository implements CoachRepositoryInterface {
  constructor(private prisma: PrismaService) {}
  async getCustomerDetail({ id }: GetCustomerDetailArgs): Promise<ReturnValueType<CoachCustomer>> {
    const response = await this.prisma.customers.findUnique({
      where: { id },
      include: { coach: true },
    });
    if (!response) {
      return [undefined, { name: 'Internal Server Error', message: 'id is invalid' }];
    }

    const {  email, uuid, createdAt, updatedAt, note, firstName, middleName, lastName, phone  } = response;
    const customerDetails: CoachCustomer =  {
      id, email, uuid, createAt: createdAt, updatedAt, note, firstName, middleName, lastName, phone,
      coach: { id: response.id, email: response.email },
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

  async getCoachCustomers({ email }: GetCoachCustomersArgs): Promise<ReturnValueType<CoachCustomer[]>> {
    const response = await this.prisma.coach.findUnique({
      where: { email },
      include: { customer: true },
    });
    if (!response) {
      return [undefined, { name: 'Internal Server Error', message: 'email is invalid' }];
    }

    const coachCustomers: CoachCustomer[] =
    response.customer.length ?
      response.customer.map((
        { id, email, uuid, createdAt, updatedAt, note, firstName, middleName, lastName, phone  }) => {
        return {
          id, email, uuid, createAt: createdAt, updatedAt, note, firstName, middleName, lastName, phone,
          coach: { id: response.id, email: response.email },
        };
      }):[];

    return [coachCustomers];
  }
}
