import { Inject, Injectable } from '@nestjs/common';

import { PrismaService } from '../../../prisma.service';
import { Transactionable } from '../../utils/transactionable.interface';
import { PrismaClient, Prisma } from '@prisma/client';
import { ReturnValueType } from '../../../filter/customError';
import { MicroGoalWithCategory } from '../../../domains/MicroGoalWithCategory';

export interface MicroGoalRepositoryInterface extends Transactionable {
  getMicroGoalsWithCategory():
  Promise<ReturnValueType<MicroGoalWithCategory[]>>;
}

@Injectable()
export class MicroGoalRepository
implements MicroGoalRepositoryInterface
{
  private originalPrismaClient : PrismaClient;
  constructor(@Inject(PrismaService) private prisma: PrismaClient | Prisma.TransactionClient) {}
  setPrismaClient(prisma: Prisma.TransactionClient): MicroGoalRepositoryInterface {
    this.originalPrismaClient = this.prisma as PrismaClient;
    this.prisma = prisma;
    return this;
  }

  setDefaultPrismaClient() {
    this.prisma = this.originalPrismaClient;
  }

  async getMicroGoalsWithCategory():
    Promise<ReturnValueType<MicroGoalWithCategory[]>> {
    const response = await this.prisma.microGoal.findMany(
      { include: { subCategory: { include: { category: true } } } });

    const microGoalsWithCategory:MicroGoalWithCategory[] = response.map((microGoal) => {
      const { subCategory } = microGoal;
      const { category } = subCategory;
      delete subCategory.category;
      return { ...microGoal, subCategory, category };
    });

    return [microGoalsWithCategory];
  }

}
