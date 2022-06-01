import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { GetCustomerNutritionUsecase } from '@Usecases/customerNutrition/getCustomerNutrition.usecase';
import { RdBoxController } from './rdBox.controller';
import { GetRdBoxUsecase } from '../../../usecases/rdBox/getRdBox.usecase';
import { RdBoxRepo } from '../../../repositories/teatisDB/rdRepo/rdBox.repo';

@Module({
  controllers: [RdBoxController],
  providers: [
    {
      provide: 'RdBoxRepoInterface',
      useClass: RdBoxRepo,
    },
    {
      provide: 'GetRdBoxUsecaseInterface',
      useClass: GetRdBoxUsecase,
    },

    RdBoxController,
    PrismaService,
  ],
  exports: [RdBoxController],
})
export class RdBoxModule {}
