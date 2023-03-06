import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

import { CreatePractitionerBoxUsecase } from '@Usecases/practitionerBox/createPractitionerBox.usecase';
import { GetPractitionerBoxByLabelUsecase } from '@Usecases/practitionerBox/getPractitionerBoxByLabel.usecase';
import { GetPractitionerBoxByUuidUsecase } from '@Usecases/practitionerBox/getPractitionerBoxByUuid.usecase';
import { PractitionerBoxController } from './practitionerBox.controller';
import { UpdateRecurringPractitionerBoxesUsecase } from '@Usecases/practitionerBox/updateRecurringPractitionerBoxes.usecase';
import { TransactionOperator } from '@Repositories/utils/transactionOperator';

@Module({
  controllers: [PractitionerBoxController],
  providers: [
    {
      provide: 'TransactionOperatorInterface',
      useClass: TransactionOperator,
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
      provide: 'GetPractitionerBoxByUuidUsecaseInterface',
      useClass: GetPractitionerBoxByUuidUsecase,
    },
    {
      provide: 'UpdateRecurringPractitionerBoxesUsecaseInterface',
      useClass: UpdateRecurringPractitionerBoxesUsecase,
    },
    PrismaService,
    PractitionerBoxController,
  ],
  exports: [PractitionerBoxController],
})
export class PractitionerBoxModule {}
