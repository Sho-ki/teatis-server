import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { GetCustomerNutritionUsecase } from '@Usecases/customerNutrition/getCustomerNutrition.usecase';
import { PractitionerBoxController } from './practitionerBox.controller';
import { GetPractitionerBoxUsecase } from '@Usecases/practitionerBox/getPractitionerBox.usecase';
import { PractitionerBoxRepo } from '@Repositories/teatisDB/practitionerRepo/practitionerBox.repo';
import { CreatePractitionerUsecase } from '../../../usecases/practitioner/createPractitioner.usecase';
import { CreatePractitionerBoxUsecase } from '../../../usecases/practitionerBox/createPractitionerBox.usecase';

@Module({
  controllers: [PractitionerBoxController],
  providers: [
    {
      provide: 'CreatePractitionerBoxUsecaseInterface',
      useClass: CreatePractitionerBoxUsecase,
    },
    {
      provide: 'PractitionerBoxRepoInterface',
      useClass: PractitionerBoxRepo,
    },
    {
      provide: 'GetPractitionerBoxUsecaseInterface',
      useClass: GetPractitionerBoxUsecase,
    },

    PractitionerBoxController,
    PrismaService,
  ],
  exports: [PractitionerBoxController],
})
export class PractitionerBoxModule {}
