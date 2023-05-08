import { Inject, Injectable } from '@nestjs/common';

import { PrismaService } from '../../../prisma.service';
import { Transactionable } from '../../utils/transactionable.interface';
import { PrismaClient, Prisma } from '@prisma/client';
import { ReturnValueType } from '../../../filter/customError';
import { MicroGoalWithActionSteps } from '../../../domains/MicroGoalWithActionSteps';

export interface MicroGoalRepositoryInterface extends Transactionable {
  getMicroGoalsWithActionSteps(): Promise<
    ReturnValueType<MicroGoalWithActionSteps[]>
  >;
}

@Injectable()
export class MicroGoalRepository implements MicroGoalRepositoryInterface {
  private originalPrismaClient: PrismaClient;
  constructor(
    @Inject(PrismaService)
    private prisma: PrismaClient | Prisma.TransactionClient,
  ) {}
  setPrismaClient(
    prisma: Prisma.TransactionClient,
  ): MicroGoalRepositoryInterface {
    this.originalPrismaClient = this.prisma as PrismaClient;
    this.prisma = prisma;
    return this;
  }

  setDefaultPrismaClient() {
    this.prisma = this.originalPrismaClient;
  }

  async getMicroGoalsWithActionSteps(): Promise<
    ReturnValueType<MicroGoalWithActionSteps[]>
    > {
    const response = await this.prisma.microGoal.findMany({
      include: {
        actionSteps: { include: { actionStepImage: { orderBy: { position: 'asc' } } } },
        subCategory: { include: { category: true } },
      },
    });
    const microGoalsWithCategory: MicroGoalWithActionSteps[] = response.map(
      (microGoal) => {
        const { subCategory, actionSteps } = microGoal;
        const { category } = subCategory;
        delete subCategory.category;
        return { ...microGoal, subCategory, category, actionSteps };
      },
    );

    return [microGoalsWithCategory];
  }
}
