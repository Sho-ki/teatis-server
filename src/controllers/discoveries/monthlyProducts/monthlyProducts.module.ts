import { Module } from '@nestjs/common';
import { PrismaService } from '../../../prisma.service';
import { MonthlySelectionRepository } from '../../../repositories/teatisDB/monthlySelection/monthlySelection.repository';
import { MonthlyProductsController } from './monthlyProducts.controller';
import { GetMonthlyProductsUsecase } from '../../../usecases/monthlyProducts/getMonthlyProducts.usecase';

@Module({
  controllers: [MonthlyProductsController],
  providers: [
    {
      provide: 'GetMonthlyProductsUsecaseInterface',
      useClass: GetMonthlyProductsUsecase,
    },
    {
      provide: 'MonthlySelectionRepositoryInterface',
      useClass: MonthlySelectionRepository,
    },

    MonthlyProductsController,
    PrismaService,
  ],
  exports: [MonthlyProductsController],
})
export class MonthlyProductsModule {}
