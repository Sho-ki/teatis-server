import { Module } from '@nestjs/common';
import { PrismaService } from '../../../prisma.service';
import { PractitionerGeneralRepo } from '@Repositories/teatisDB/practitionerRepo/practitionerGeneral.repository';
import { CreatePractitionerUsecase } from '../../../usecases/practitioner/createPractitioner.usecase';
import { GetPractitionerUsecase } from '../../../usecases/practitioner/getPractitioner.usecase';
import { PractitionerController } from './practitioner.controller';

@Module({
  controllers: [PractitionerController],
  providers: [
    {
      provide: 'GetPractitionerUsecaseInterface',
      useClass: GetPractitionerUsecase,
    },
    {
      provide: 'PractitionerGeneralRepoInterface',
      useClass: PractitionerGeneralRepo,
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
