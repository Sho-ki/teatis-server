import { Module } from '@nestjs/common';
import { PrismaService } from '../../../prisma.service';
import { CreatePractitionerUsecase } from '@Usecases/practitioner/createPractitioner.usecase';
import { GetPractitionerUsecase } from '@Usecases/practitioner/getPractitioner.usecase';
import { PractitionerController } from './practitioner.controller';

@Module({
  controllers: [PractitionerController],
  providers: [
    {
      provide: 'GetPractitionerUsecaseInterface',
      useClass: GetPractitionerUsecase,
    },
    {
      provide: 'CreatePractitionerUsecaseInterface',
      useClass: CreatePractitionerUsecase,
    },

    PractitionerController,
    PrismaService,
  ],
  exports: [PractitionerController],
})
export class PractitionerModule {}
