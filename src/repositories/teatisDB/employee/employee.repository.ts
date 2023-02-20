import { Injectable } from '@nestjs/common';

import { PrismaService } from '../../../prisma.service';
import { ReturnValueType } from '@Filters/customError';
import { EmployeeCustomer, EmployeeCustomerWithAddress } from '../../../domains/EmployeeCustomer';

export interface ConnectCustomerWithEmployerArgs {
  customerId: number;
  employerUuid: string;
}

export interface GetActiveEmployeeCustomersForOrderArgs {
  monthlyOrderInterval: number;
}

export interface EmployeeRepositoryInterface {
  connectCustomerWithEmployer({ customerId, employerUuid }: ConnectCustomerWithEmployerArgs):
  Promise<ReturnValueType<EmployeeCustomer>>;

  getActiveEmployeeCustomersForOrder({ monthlyOrderInterval }:GetActiveEmployeeCustomersForOrderArgs):
  Promise<ReturnValueType<EmployeeCustomerWithAddress[]>>;
}

@Injectable()
export class EmployeeRepository implements EmployeeRepositoryInterface {
  constructor(private prisma: PrismaService) {}

  async connectCustomerWithEmployer({ customerId, employerUuid }: ConnectCustomerWithEmployerArgs):
  Promise<ReturnValueType<EmployeeCustomer>> {
    try{
      const response = await this.prisma.customers.update({
        where: { id: customerId },
        data: {
          employee: {
            upsert: {
              create: { employer: { connect: { uuid: employerUuid } }, emailEligibility: 'eligible' },
              update: { employer: { connect: { uuid: employerUuid } } },
            },
          },
        },
        include: { employee: { include: { employer: true } } },
      });
      return [response];
    }catch(error){
      if(error.code === 'P2025'){
        return [undefined, { name: 'EmployerNotFound', message: 'Employer not found' }];
      }
    }
  }
  async getActiveEmployeeCustomersForOrder({ monthlyOrderInterval }:GetActiveEmployeeCustomersForOrderArgs):
  Promise<ReturnValueType<EmployeeCustomerWithAddress[]>>{
    const date = new Date();
    date.setMonth(date.getMonth() - monthlyOrderInterval);
    const response = await this.prisma.customers.findMany({
      where: {
        boxSubscribed: 'active', employee: { emailEligibility: 'eligible', monthlyOrderInterval },
        NOT: {
          customerEventLog: {
            some:
          { eventDate: { gte: date }, type: 'boxOrdered' },
          },
        },
      },
      include: { employee: { include: { employer: true } }, customerAddress: true },
    });
    return [response];

  }
}
