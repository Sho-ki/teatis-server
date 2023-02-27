import { Module } from '@nestjs/common';
import { PrismaService } from '../../../prisma.service';
import { UpsertProductUsecase } from '@Usecases/product/upsertProduct.usecase';
import { ProductController } from './product.controller';
import { TransactionOperator } from '@Repositories/utils/transactionOperator';

@Module({
  controllers: [ProductController],
  exports: [ProductController],
  providers: [
    {
      provide: 'UpsertProductUsecaseInterface',
      useClass: UpsertProductUsecase,
    },
    {
      provide: 'TransactionOperatorInterface',
      useClass: TransactionOperator,
    },
    ProductController,
    PrismaService,
  ],
})
export class ProductModule {}
