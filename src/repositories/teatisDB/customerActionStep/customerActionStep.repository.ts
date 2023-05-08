import { Inject, Injectable } from '@nestjs/common';

import { PrismaService } from '../../../prisma.service';
import { Transactionable } from '../../utils/transactionable.interface';
import { PrismaClient, Prisma  } from '@prisma/client';
import { ReturnValueType } from '../../../filter/customError';

interface CreateCustomerActionStepsArgs {
  customerId: number;
  actionStepIds: number[];
  customerMicroGoalId: number;
}

export interface CustomerActionStepRepositoryInterface extends Transactionable {
  createCustomerActionSteps({
    customerId,
    customerMicroGoalId,
    actionStepIds,
  }: CreateCustomerActionStepsArgs): Promise<
    ReturnValueType<Prisma.BatchPayload>
  >;
}

@Injectable()
export class CustomerActionStepRepository
implements CustomerActionStepRepositoryInterface
{
  private originalPrismaClient: PrismaClient;
  constructor(
    @Inject(PrismaService)
    private prisma: PrismaClient | Prisma.TransactionClient,
  ) {}
  setPrismaClient(
    prisma: Prisma.TransactionClient,
  ): CustomerActionStepRepositoryInterface {
    this.originalPrismaClient = this.prisma as PrismaClient;
    this.prisma = prisma;
    return this;
  }

  setDefaultPrismaClient() {
    this.prisma = this.originalPrismaClient;
  }

  async createCustomerActionSteps({
    customerId,
    customerMicroGoalId,
    actionStepIds,
  }: CreateCustomerActionStepsArgs): Promise<
    ReturnValueType<Prisma.BatchPayload>
  > {
    const response = await this.prisma.customerActionStep.createMany({
      data: actionStepIds.map((actionStepId) => ({
        customerId,
        customerMicroGoalId,
        actionStepId,
      })),
    });

    return [response];
  }
}
