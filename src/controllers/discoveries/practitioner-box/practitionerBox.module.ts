import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

import { CreatePractitionerBoxUsecase } from '@Usecases/practitionerBox/createPractitionerBox.usecase';
import { GetAllRecurringPractitionerBoxesUsecase } from '@Usecases/practitionerBox/getAllRecurringBoxes.usecase';
import { GetPractitionerBoxByLabelUsecase } from '@Usecases/practitionerBox/getPractitionerBoxByLabel.usecase';
import { GetPractitionerBoxByUuidUsecase } from '@Usecases/practitionerBox/getPractitionerBoxByUuid.usecase';
import { GetRecurringPractitionerBoxUsecase } from '@Usecases/practitionerBox/getRecurringPractitionerBox.usecase';
import { PractitionerBoxController } from './practitionerBox.controller';
import { PractitionerBoxRepository } from '@Repositories/teatisDB/practitioner/practitionerBox.repo';
import { PractitionerGeneralRepository } from '@Repositories/teatisDB/practitioner/practitionerGeneral.repository';
import { GetAllPractitionerBoxesUsecase } from '@Usecases/practitionerBox/getAllPractitionerBoxes.usecase';
import { UpdateRecurringPractitionerBoxesUsecase } from '@Usecases/practitionerBox/updateRecurringPractitionerBoxes.usecase';
import { GetAllProductsUsecase } from '@Usecases/product/getAllProducts.usecase';
import { ProductGeneralRepository } from '@Repositories/teatisDB/product/productGeneral.repository';

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
      provide: 'GetRecurringPractitionerBoxUsecaseInterface',
      useClass: GetRecurringPractitionerBoxUsecase,
    },
    {
      provide: 'GetAllRecurringPractitionerBoxesUsecaseInterface',
      useClass: GetAllRecurringPractitionerBoxesUsecase,
    },
    {
      provide: 'GetAllPractitionerBoxesUsecaseInterface',
      useClass: GetAllPractitionerBoxesUsecase,
    },
    {
      provide: 'UpdateRecurringPractitionerBoxesUsecaseInterface',
      useClass: UpdateRecurringPractitionerBoxesUsecase,
    },
    {
      provide: 'GetAllProductsUsecaseInterface',
      useClass: GetAllProductsUsecase,
    },
    {
      provide: 'ProductGeneralRepositoryInterface',
      useClass: ProductGeneralRepository,
    },
    PractitionerBoxController,
    PrismaService,
  ],
  exports: [PractitionerBoxController],
})
export class PractitionerBoxModule {}
