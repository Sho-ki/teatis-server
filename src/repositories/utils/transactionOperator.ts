import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';
import { Transactionable } from './transactionable.interface';

export interface TransactionOperatorInterface {
  performAtomicOperations<T>(
    repositories: Array<Transactionable>,
    transactionBlock: () => Promise<T>
  ): Promise<T> ;
}

@Injectable()
export class TransactionOperator
implements TransactionOperatorInterface
{
  constructor(private prisma: PrismaService) {}
  async performAtomicOperations<T>(
    repositories: Array<Transactionable>,
    transactionBlock: () => Promise<T>
  ): Promise<T> {
    return await this.prisma.$transaction(async (prisma: Prisma.TransactionClient) => {
      if (repositories.length === 0) {
        throw new Error('addRepositoriesForAtomicOperation should be called before `performAtomicOperations`');
      }

      repositories.forEach((repository) => {
        repository.setPrismaClient(prisma);
      });

      const response = await transactionBlock();

      repositories.forEach((repository) => {
        repository.setDefaultPrismaClient();
      });

      return response;
    });
  }
}
