import { Injectable } from '@nestjs/common';

import { PrismaService } from '../../../prisma.service';
import { ReturnValueType } from '@Filters/customError';
import { CoachCustomer } from '../../../domains/CoachCustomer';
import { Coach } from '../../../domains/Coach';

export interface GetCoachCustomersArgs {
  email: string;
}

export interface ConnectCustomerCoachArgs {
  customerId: number;
  coachId:number;
}

export interface GetCoachArgs {
  email:string;
}

export interface CustomerCoachRepositoryInterface {
  getCustomerCoach({ email }: GetCoachCustomersArgs): Promise<ReturnValueType<CoachCustomer[]>>;

  connectCustomerCoach({ coachId, customerId }:ConnectCustomerCoachArgs):
  Promise<ReturnValueType<Coach>>;

  getCoachByEmail({ email }:GetCoachArgs):
  Promise<ReturnValueType<Coach>>;
}

@Injectable()
export class CustomerCoachRepository implements CustomerCoachRepositoryInterface {
  constructor(private prisma: PrismaService) {}

  async getCoachByEmail({ email }:GetCoachArgs):
  Promise<ReturnValueType<Coach>>{
    const response = await this.prisma.coach.findUnique({ where: { email } });
    if(!response){
      return [undefined, { name: 'getCoachByEmail Error', message: 'email is invalid' }];
    }
    return [{ id: response.id, email: response.email }];
  }

  async connectCustomerCoach({ coachId, customerId }: ConnectCustomerCoachArgs)
  : Promise<ReturnValueType<Coach>> {

    const response = await this.prisma.intermediateCustomerCoach.upsert(
      {
        where: { coachId_customerId: { coachId, customerId } },
        create: { coachId, customerId },
        update: {},
        include: { coach: true },
      },);

    return [{ id: coachId, email: response.coach.email }];
  }

  async getCustomerCoach({ email }: GetCoachCustomersArgs): Promise<ReturnValueType<CoachCustomer[]>> {
    const response = await this.prisma.coach.findUnique({
      where: { email },
      include: { intermediateCustomerCoach: { include: { customer: true } } },
    });
    if (!response) {
      return [undefined, { name: 'Internal Server Error', message: 'email is invalid' }];
    }

    const coachCustomers: CoachCustomer[] =
    response.intermediateCustomerCoach.length ?response.intermediateCustomerCoach.map(({ customer }) => {
      const { id, email, uuid, createdAt, updatedAt, note, firstName, middleName, lastName, phone  } = customer;
      return {
        id, email, uuid, createAt: createdAt, updatedAt, note, firstName, middleName, lastName, phone,
        coach: { id: response.id, email: response.email },
      };
    }):[];

    return [coachCustomers];
  }
}
