import { Module } from '@nestjs/common';
import { PrismaService } from '../../../prisma.service';
import { PractitionerGeneralRepository } from '@Repositories/teatisDB/practitioner/practitionerGeneral.repository';
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
      provide: 'PractitionerGeneralRepositoryInterface',
      useClass: PractitionerGeneralRepository,
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
