import { Module } from '@nestjs/common';
import { GetTerraAuthUrlUsecase } from '@Usecases/terraAuth/getTerraAuthUrl.usecase';
import { UpsertAllCustomersGlucoseUsecase } from '../../usecases/terraCustomerGlucose/upsertAllCustomersGlucose.usecase';
import { PostTerraAuthSuccessUsecase } from '../../usecases/terraAuth/postTerraAuthSuccess.usecase';
import { TerraController } from './terra.controller';
import { PrismaService } from '../../prisma.service';

@Module({
  controllers: [TerraController], exports: [TerraController],
  providers: [
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
    TerraController,
    PrismaService,
  ],
})
export class TerraModule {}
