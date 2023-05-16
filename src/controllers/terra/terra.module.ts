import { Module } from '@nestjs/common';
import { TerraRepository } from '@Repositories/terra/terra.repository';
import { GetTerraAuthUrlUsecase } from '@Usecases/terraAuth/getTerraAuthUrl.usecase';
import { UpsertAllCustomersGlucoseUsecase } from '../../usecases/terraCustomerGlucose/upsertAllCustomersGlucose.usecase';
import { PostTerraAuthSuccessUsecase } from '../../usecases/terraAuth/postTerraAuthSuccess.usecase';
import { TerraController } from './terra.controller';
import { TerraCustomerRepository } from '../../repositories/teatisDB/terraCustomer/terraCustomer.repository';
import { PrismaService } from '../../prisma.service';

@Module({
  controllers: [TerraController], exports: [TerraController],
  providers: [
    {
      provide:
      'TerraCustomerRepositoryInterface',
      useClass: TerraCustomerRepository,
    },
    {
      provide:
      'PostTerraAuthSuccessUsecaseInterface',
      useClass: PostTerraAuthSuccessUsecase,
    },
    {
      provide:
      'UpsertAllCustomersGlucoseUsecaseInterface',
      useClass: UpsertAllCustomersGlucoseUsecase,
    },

    {
      provide:
      'GetTerraAuthUrlUsecaseInterface',
      useClass: GetTerraAuthUrlUsecase,
    },
    {
      provide: 'TerraRepositoryInterface',
      useClass: TerraRepository,
    },
    TerraController,
    PrismaService,
  ],
})
export class TerraModule {}
