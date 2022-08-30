import { Module } from '@nestjs/common';
import { TerraRepository } from '../../repositories/terra/terra.repository';
import { GetTerraAuthUrlUsecase } from '../../usecases/terraAuth/getTerraAuthUrl.usecase';
import { TerraController } from './terra.controller';

@Module({
  controllers: [TerraController], exports: [TerraController],
  providers: [
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
