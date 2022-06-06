import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { PractitionerBoxController } from './practitionerBox.controller';
import { GetPractitionerBoxByUuidUsecase } from '@Usecases/practitionerBox/getPractitionerBoxByUuid.usecase';
import { PractitionerBoxRepo } from '@Repositories/teatisDB/practitionerRepo/practitionerBox.repo';
import { CreatePractitionerBoxUsecase } from '@Usecases/practitionerBox/createPractitionerBox.usecase';
import { GetPractitionerBoxByLabelUsecase } from '@Usecases/practitionerBox/getPractitionerBoxByLabel.usecase';
import { PractitionerGeneralRepo } from '@Repositories/teatisDB/practitionerRepo/practitionerGeneral.repository';

@Module({
  controllers: [PractitionerBoxController],
  providers: [
    {
      provide: 'PractitionerGeneralRepoInterface',
      useClass: PractitionerGeneralRepo,
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
      provide: 'PractitionerBoxRepoInterface',
      useClass: PractitionerBoxRepo,
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
