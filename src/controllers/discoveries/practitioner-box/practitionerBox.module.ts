import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { PractitionerBoxController } from './practitionerBox.controller';
import { GetPractitionerBoxByUuidUsecase } from '@Usecases/practitionerBox/getPractitionerBoxByUuid.usecase';
import { PractitionerBoxRepository } from '@Repositories/teatisDB/practitioner/practitionerBox.repo';
import { CreatePractitionerBoxUsecase } from '@Usecases/practitionerBox/createPractitionerBox.usecase';
import { GetPractitionerBoxByLabelUsecase } from '@Usecases/practitionerBox/getPractitionerBoxByLabel.usecase';
import { PractitionerGeneralRepository } from '@Repositories/teatisDB/practitioner/practitionerGeneral.repository';

@Module({
  controllers: [PractitionerBoxController],
  providers: [
    {
      provide: 'PractitionerGeneralRepositoryInterface',
      useClass: PractitionerGeneralRepository,
    },
    {
      provide: 'GetPractitionerBoxByLabelUsecaseInterface',
      useClass: GetPractitionerBoxByLabelUsecase,
    },
    {
      provide: 'CreatePractitionerBoxUsecaseInterface',
      useClass: CreatePractitionerBoxUsecase,
    },
    {
      provide: 'PractitionerBoxRepositoryInterface',
      useClass: PractitionerBoxRepository,
    },
    {
      provide: 'GetPractitionerBoxByUuidUsecaseInterface',
      useClass: GetPractitionerBoxByUuidUsecase,
    },

    PractitionerBoxController,
    PrismaService,
  ],
  exports: [PractitionerBoxController],
})
export class PractitionerBoxModule {}
