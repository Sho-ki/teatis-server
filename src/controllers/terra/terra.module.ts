import { Module } from '@nestjs/common';
import { CustomerGeneralRepository } from '@Repositories/teatisDB/customer/customerGeneral.repository';
import { TerraRepository } from '@Repositories/terra/terra.repository';
import { GetTerraAuthUrlUsecase } from '@Usecases/terraAuth/getTerraAuthUrl.usecase';
import { UpsertAllCustomersGlucoseUsecase } from '../../usecases/terraCustomerGlucose/upsertAllCustomersGlucose.usecase';
import { TerraController } from './terra.controller';

@Module({
  controllers: [TerraController], exports: [TerraController],
  providers: [
    {
      provide:
      'UpsertAllCustomersGlucoseUsecaseInterface',
      useClass: UpsertAllCustomersGlucoseUsecase,
    },
    {
      provide:
      'CustomerGeneralRepositoryInterface',
      useClass: CustomerGeneralRepository,
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
  ],
})
export class TerraModule {}
