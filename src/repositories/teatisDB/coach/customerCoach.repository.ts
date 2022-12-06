import { Injectable } from '@nestjs/common';

import { PrismaService } from '../../../prisma.service';
import { ReturnValueType } from '@Filters/customError';
import { CoachCustomer } from '../../../domains/CoachCustomer';

export interface GetCoachCustomersArgs {
  email: string;
}

export interface CustomerCoachRepositoryInterface {
  getCustomerCoach({ email }: GetCoachCustomersArgs): Promise<ReturnValueType<CoachCustomer[]>>;

}

@Injectable()
export class CustomerCoachRepository implements CustomerCoachRepositoryInterface {
  constructor(private prisma: PrismaService) {}

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
