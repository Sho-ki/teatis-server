// import { Module } from '@nestjs/common';
// import { CustomerGeneralRepository } from '@Repositories/teatisDB/customer/customerGeneral.repository';
// import { TerraRepository } from '@Repositories/terra/terra.repository';
// import { GetTerraAuthUrlUsecase } from '@Usecases/terraAuth/getTerraAuthUrl.usecase';
// import { UpsertAllCustomersGlucoseUsecase } from '../../usecases/terraCustomerGlucose/upsertAllCustomersGlucose.usecase';
// import { PostTerraAuthSuccessUsecase } from '../../usecases/terraAuth/postTerraAuthSuccess.usecase';
// import { TerraController } from './terra.controller';
// import { TerraCustomerRepository } from '../../repositories/teatisDB/terraCustomer/terraCustomer.repository';
// import { PrismaService } from '../../prisma.service';

// @Module({
//   controllers: [TwilioController], exports: [TwilioController],
//   providers: [
//     {
//       provide: 'TerraRepositoryInterface',
//       useClass: TerraRepository,
//     },
//     TerraController,
//     PrismaService,
//   ],
// })
// export class TwilioModule {}
