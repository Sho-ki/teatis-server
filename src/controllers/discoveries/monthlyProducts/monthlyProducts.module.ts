import { Module } from '@nestjs/common';
import { PrismaService } from '../../../prisma.service';
import { MonthlyProductsController } from './monthlyProducts.controller';
import { GetMonthlyProductsUsecase } from '../../../usecases/monthlyProducts/getMonthlyProducts.usecase';

@Module({
  controllers: [MonthlyProductsController],
  providers: [
    {
      provide: 'GetMonthlyProductsUsecaseInterface',
      useClass: GetMonthlyProductsUsecase,
    },

    MonthlyProductsController,
    PrismaService,
  ],
  exports: [MonthlyProductsController],
})
export class MonthlyProductsModule {}
