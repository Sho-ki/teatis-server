import { Prisma } from '@prisma/client';

export interface Transactionable {
  setPrismaClient: (prisma : Prisma.TransactionClient) => void;
  setDefaultPrismaClient: () => void;
}
