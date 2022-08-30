import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';
import { Transactionable } from './transactionable.interface';

export interface TransactionOperatorInterface {
  addRepositoriesForAtomicOperation(repositories: Array<Transactionable>);
  performAtomicOperations<T>(transactionBlock: (prisma: Prisma.TransactionClient) => Promise<T>): Promise<T> ;
}

@Injectable()
export class TransactionOperator
implements TransactionOperatorInterface
{
  private repositories: Array<Transactionable>;
  constructor(private prisma: PrismaService) {
    this.repositories = [];
  }

  addRepositoriesForAtomicOperation(repositories: Array<Transactionable>) {
    this.repositories = repositories;
    return this;
  }

  async performAtomicOperations<T>(transactionBlock: (prisma: Prisma.TransactionClient) => Promise<T>): Promise<T> {
    return await this.prisma.$transaction(async (prismaTransactionClient: Prisma.TransactionClient) => {
      if (this.repositories.length === 0) {
        throw new Error('addRepositoriesForAtomicOperation should be called before `performAtomicOperations`');
      }

      this.repositories.forEach((repository) => {
        repository.setPrismaClient(prismaTransactionClient);
      });

      const response = await transactionBlock(prismaTransactionClient);

      this.repositories.forEach((repository) => {
        repository.setDefaultPrismaClient();
      });

      return response;
    });
  }
}
