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
import { UpdateCustomerOrderOfPractitionerBoxUsecase } from '@Usecases/customerOrder/updateCustomerOrderOfPractitionerBox.usecase';
import { UpdateCustomerOrderOfPractitionerMealBoxUsecase } from '@Usecases/customerOrder/updateCustomerOrderOfPractitionerMealBox.usecase';
import { GetAllRecurringPractitionerBoxesUsecase } from '@Usecases/practitionerBox/getAllRecurringBoxes.usecase';
import { TransactionOperator } from '@Repositories/utils/transactionOperator';

@Module({
  controllers: [PractitionerBoxController],
  providers: [
    {
      provide: 'PractitionerBoxRepositoryInterface',
      useClass: PractitionerBoxRepository,
    },
    {
      provide: 'UpdateCustomerOrderOfPractitionerBoxUsecaseInterface',
      useClass: UpdateCustomerOrderOfPractitionerBoxUsecase,
    },
    {
      provide: 'UpdateCustomerOrderOfPractitionerMealBoxUsecaseInterface',
      useClass: UpdateCustomerOrderOfPractitionerMealBoxUsecase,
    },
    {
      provide: 'CreatePractitionerBoxUsecaseInterface',
      useClass: CreatePractitionerBoxUsecase,
    },
    {
      provide: 'PractitionerGeneralRepositoryInterface',
      useClass: PractitionerGeneralRepository,
    },
    {
      provide: 'GetAllRecurringPractitionerBoxesUsecaseInterface',
      useClass: GetAllRecurringPractitionerBoxesUsecase,
    },
    {
      provide: 'GetPractitionerBoxByLabelUsecaseInterface',
      useClass: GetPractitionerBoxByLabelUsecase,
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
      provide: 'TransactionOperatorInterface',
      useClass: TransactionOperator,
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
