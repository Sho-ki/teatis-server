import { Module } from '@nestjs/common';
import { ShipheroAuthRepo } from '../../repositories/shiphero/shipheroAuth.repository';
import { UpdateShipheoKeyUsecase } from '../../usecases/shipheroKey/updateShipheroKey.usecase';
import { ShipheroKeyController } from './shipheroKey.controller';

@Module({
  controllers: [ShipheroKeyController],
  exports: [ShipheroKeyController],
  providers: [
    {
      provide: 'ShipheroAuthRepoInterface',
      useClass: ShipheroAuthRepo,
    },
    {
      provide: 'UpdateShipheoKeyUsecaseInterface',
      useClass: UpdateShipheoKeyUsecase,
    },
    ShipheroKeyController,
  ],
})
export class ShipheroKeyModule {}
