import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { EmailController } from './email.controller';
import { EmailUsecase } from '@Usecases/sendEmail/sendEmail';
import { KlaviyoRepository } from '@Repositories/klaviyo/klaviyo.repository';

@Module({
  controllers: [EmailController],
  providers: [
    {
      provide: 'EmailUsecaseInterface',
      useClass: EmailUsecase,
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
