import { Module } from '@nestjs/common';
import { ShipheroAuthRepository } from '@Repositories/shiphero/shipheroAuth.repository';
import { UpdateShipheoKeyUsecase } from '@Usecases/shipheroKey/updateShipheroKey.usecase';
import { ShipheroKeyController } from './shipheroKey.controller';

@Module({
  controllers: [ShipheroKeyController],
  exports: [ShipheroKeyController],
  providers: [
    {
      provide: 'ShipheroAuthRepositoryInterface',
      useClass: ShipheroAuthRepository,
    },
    {
      provide: 'UpdateShipheoKeyUsecaseInterface',
      useClass: UpdateShipheoKeyUsecase,
    },
    ShipheroKeyController,
  ],
})
export class ShipheroKeyModule {}
