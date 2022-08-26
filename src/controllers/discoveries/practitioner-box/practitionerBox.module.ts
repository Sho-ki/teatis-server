import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

import { CreatePractitionerBoxUsecase } from '@Usecases/practitionerBox/createPractitionerBox.usecase';
import { GetPractitionerBoxByLabelUsecase } from '@Usecases/practitionerBox/getPractitionerBoxByLabel.usecase';
import { GetPractitionerBoxByUuidUsecase } from '@Usecases/practitionerBox/getPractitionerBoxByUuid.usecase';
import { PractitionerBoxController } from './practitionerBox.controller';
import { PractitionerBoxRepository } from '@Repositories/teatisDB/practitioner/practitionerBox.repo';
import { PractitionerGeneralRepository } from '@Repositories/teatisDB/practitioner/practitionerGeneral.repository';
import { UpdateRecurringPractitionerBoxesUsecase } from '@Usecases/practitionerBox/updateRecurringPractitionerBoxes.usecase';
import { ProductGeneralRepository } from '@Repositories/teatisDB/product/productGeneral.repository';
import { UpsertRecurringPractitionerBoxesUsecase } from '@Usecases/practitonerRecurringBox/upsertPractitionerRecurringBox.usecase';
import { CreateMasterMonthlyBoxUsecase } from '@Usecases/masterMonthlyBox/createMasterMonthlyBox.usecase';
import { MasterMonthlyBoxRepository } from '@Repositories/teatisDB/masterMonthlyBox/masterMonthlyBox.repository';

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
    {
      provide: 'UpdateRecurringPractitionerBoxesUsecaseInterface',
      useClass: UpdateRecurringPractitionerBoxesUsecase,
    },
    {
      provide: 'ProductGeneralRepositoryInterface',
      useClass: ProductGeneralRepository,
    },
    {
      provide: 'UpsertRecurringPractitionerBoxesUsecaseInterface',
      useClass: UpsertRecurringPractitionerBoxesUsecase,
    },
    {
      provide: 'CreateMasterMonthlyBoxUsecaseInterface',
      useClass: CreateMasterMonthlyBoxUsecase,
    },
    {
      provide: 'MasterMonthlyBoxRepositoryInterface',
      useClass: MasterMonthlyBoxRepository,
    },
    PractitionerBoxController,
    PrismaService,
  ],
  exports: [PractitionerBoxController],
})
export class PractitionerBoxModule {}
