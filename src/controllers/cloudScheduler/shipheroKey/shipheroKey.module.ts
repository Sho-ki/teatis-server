import { Module } from '@nestjs/common';
import { UpdateShipheoKeyUsecase } from '@Usecases/shipheroKey/updateShipheroKey.usecase';
import { ShipheroKeyController } from './shipheroKey.controller';

@Module({
  controllers: [ShipheroKeyController],
  exports: [ShipheroKeyController],
  providers: [
    {
      provide: 'UpdateShipheoKeyUsecaseInterface',
      useClass: UpdateShipheoKeyUsecase,
    },
    ShipheroKeyController,
  ],
})
export class ShipheroKeyModule {}
