import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { EmailController } from './email.controller';
import { KlaviyoRepository } from '@Repositories/klaviyo/klaviyo.repository';
import { PostEmailUsecase } from '@Usecases/email/postCustomerEmail';

@Module({
  controllers: [EmailController],
  providers: [
    {
      provide: 'PostEmailUsecaseInterface',
      useClass: PostEmailUsecase,
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
