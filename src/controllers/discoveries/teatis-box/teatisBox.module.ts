import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { TeatisBoxController } from './teatisBox.controller';
import { CreateTeatisBoxUsecase } from '@Usecases/teatisBox/createTeatisBox.usecase';

@Module({
  controllers: [TeatisBoxController],
  providers: [
    {
      provide: 'CreateTeatisBoxUsecaseInterface',
      useClass: CreateTeatisBoxUsecase,
    },

    TeatisBoxController,
    PrismaService,
  ],
  exports: [TeatisBoxController],
})
export class PractitionerBoxModule {}
