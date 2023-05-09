import { Inject, Injectable } from '@nestjs/common';

import { PrismaService } from '../../../prisma.service';
import { Transactionable } from '../../utils/transactionable.interface';
import { PrismaClient, Prisma, CustomerMicroGoal } from '@prisma/client';
import { ReturnValueType } from '../../../filter/customError';
import { CustomerMicroGoalWithActionSteps } from '../../../domains/CustomerMicroGoalWithActionSteps';

interface GetCustomerMicroGoalsArgs {
  customerId: number;
}

interface GetCustomerMicroGoalsWithActionStepsArgs {
  customerId: number;
}

interface CreateCustomerMicroGoalArgs {
  customerId: number;
  microGoal: {
    id: number;
    order: number;
  };
}

export interface CustomerMicroGoalRepositoryInterface extends Transactionable {
  getCustomerMicroGoals({ customerId }: GetCustomerMicroGoalsArgs): Promise<ReturnValueType<CustomerMicroGoal[]>>;

  getCustomerMicroGoalsWithActionSteps({ customerId }: GetCustomerMicroGoalsWithActionStepsArgs): Promise<
    ReturnValueType<CustomerMicroGoalWithActionSteps[]>
  >;

  createCustomerMicroGoal({
    customerId,
    microGoal,
  }: CreateCustomerMicroGoalArgs): Promise<ReturnValueType<CustomerMicroGoal>>;
}

@Injectable()
export class CustomerMicroGoalRepository
implements CustomerMicroGoalRepositoryInterface
{
  private originalPrismaClient: PrismaClient;
  constructor(
    @Inject(PrismaService)
    private prisma: PrismaClient | Prisma.TransactionClient,
  ) {}
  setPrismaClient(
    prisma: Prisma.TransactionClient,
  ): CustomerMicroGoalRepositoryInterface {
    this.originalPrismaClient = this.prisma as PrismaClient;
    this.prisma = prisma;
    return this;
  }

  setDefaultPrismaClient() {
    this.prisma = this.originalPrismaClient;
  }

  async getCustomerMicroGoals({ customerId }: GetCustomerMicroGoalsArgs):
   Promise<ReturnValueType<CustomerMicroGoal[]>> {
    const response = await this.prisma.customerMicroGoal.findMany({ where: { customerId } });

    return [response];
  }

  async createCustomerMicroGoal({
    customerId,
    microGoal,
  }: CreateCustomerMicroGoalArgs): Promise<ReturnValueType<CustomerMicroGoal>> {
    const response = await this.prisma.customerMicroGoal.create({
      data: {
        customerId,
        microGoalId: microGoal.id,
        order: microGoal.order,
      },
    });
    return [response];
  }

  async getCustomerMicroGoalsWithActionSteps({ customerId }:
     GetCustomerMicroGoalsWithActionStepsArgs): Promise<
    ReturnValueType<CustomerMicroGoalWithActionSteps[]>
  > {
    const response = await this.prisma.customerMicroGoal.findMany({
      where: { customerId },
      orderBy: { order: 'asc' },
      include: {
        customerActionSteps: { include: { customerActionStepImage: true } },
        microGoal: {
          include: {
            actionSteps: { include: { actionStepImage: true } },
            subCategory: { include: { category: true } },
          },
        },
      },
    });

    if (!response.length)
      return [
        undefined,
        {
          name: 'NotFound',
          message: 'Customer micro goals not found. Please take a survey first',
        },
      ];

    const customerMicroGoalsWithActionSteps: CustomerMicroGoalWithActionSteps[] =
      response.map((customerMicroGoal) => {
        const label = customerMicroGoal.microGoal.label;
        const category = customerMicroGoal.microGoal.subCategory.category;

        const actionSteps = customerMicroGoal.microGoal.actionSteps;

        const customerActionSteps = customerMicroGoal.customerActionSteps;

        return {
          ...customerMicroGoal,
          actionSteps,
          customerActionSteps,
          label,
          category,
        };
      });

    return [customerMicroGoalsWithActionSteps];
  }
}
