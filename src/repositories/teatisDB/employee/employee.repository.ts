import { Injectable } from '@nestjs/common';

import { PrismaService } from '../../../prisma.service';
import { ReturnValueType } from '@Filters/customError';
import { EmployeeCustomer } from '../../../domains/EmployeeCustomer';

export interface ConnectCustomerWithEmployerArgs {
  customerId: number;
  employerUuid: string;
}

export interface EmployeeRepositoryInterface {
  connectCustomerWithEmployer({ customerId, employerUuid }: ConnectCustomerWithEmployerArgs):
  Promise<ReturnValueType<EmployeeCustomer>>;
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
}
