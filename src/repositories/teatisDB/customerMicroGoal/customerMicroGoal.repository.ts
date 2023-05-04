import { Inject, Injectable } from '@nestjs/common';

import { PrismaService } from '../../../prisma.service';
import { Transactionable } from '../../utils/transactionable.interface';
import { PrismaClient, Prisma, CustomerMicroGoal } from '@prisma/client';
import { ReturnValueType } from '../../../filter/customError';

interface GetCustomerMicroGoalArgs {
    customerId: number;
}

interface CreateCustomerMicroGoalsArgs {
    customerId: number;
    microGoals : {
        id: number;
        order: number;
    }[];
}

export interface CustomerMicroGoalRepositoryInterface extends Transactionable {
  getCustomerMicroGoals({ customerId }: GetCustomerMicroGoalArgs):
  Promise<ReturnValueType<CustomerMicroGoal[]>>;

  createCustomerMicroGoals({ customerId, microGoals }: CreateCustomerMicroGoalsArgs)
  :Promise<ReturnValueType<Prisma.BatchPayload>>;
}

@Injectable()
export class CustomerMicroGoalRepository
implements CustomerMicroGoalRepositoryInterface
{
  private originalPrismaClient : PrismaClient;
  constructor(@Inject(PrismaService) private prisma: PrismaClient | Prisma.TransactionClient) {}
  setPrismaClient(prisma: Prisma.TransactionClient): CustomerMicroGoalRepositoryInterface {
    this.originalPrismaClient = this.prisma as PrismaClient;
    this.prisma = prisma;
    return this;
  }

  setDefaultPrismaClient() {
    this.prisma = this.originalPrismaClient;
  }

  async getCustomerMicroGoals(
    { customerId }: GetCustomerMicroGoalArgs):
    Promise<ReturnValueType<CustomerMicroGoal[]>> {
    const response = await this.prisma.customerMicroGoal.findMany(
      { where: { customerId } });

    return [response];
  }

  async createCustomerMicroGoals(
    { customerId, microGoals }: CreateCustomerMicroGoalsArgs):
    Promise<ReturnValueType<Prisma.BatchPayload>> {
    const response = await this.prisma.customerMicroGoal.createMany({
      data: microGoals.map((microGoal) => ({ customerId, microGoalId: microGoal.id, order: microGoal.order })),
      skipDuplicates: true,
    });
    return [response];
  }

}
