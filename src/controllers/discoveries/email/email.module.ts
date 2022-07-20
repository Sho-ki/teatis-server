import { DeleteEmailUsecase } from '@Usecases/email/deleteEmail';
import { EmailController } from './email.controller';
import { KlaviyoRepository } from '@Repositories/klaviyo/klaviyo.repository';
import { Module } from '@nestjs/common';
import { PostEmailUsecase } from '@Usecases/email/postCustomerEmail';
import { PrismaService } from 'src/prisma.service';

@Module({
  controllers: [EmailController],
  providers: [
    {
      provide: 'PostEmailUsecaseInterface',
      useClass: PostEmailUsecase,
    },
    {
      provide: 'DeleteEmailUsecaseInterface',
      useClass: DeleteEmailUsecase,
    },
    {
      provide: 'KlaviyoRepositoryInterface',
      useClass: KlaviyoRepository,
    },
    EmailController,
    PrismaService,
  ],
  exports: [EmailController],
})
export class EmailModule {}
