import { Logger, Module } from '@nestjs/common';
import { Twilio } from 'twilio';
import { PrismaService } from '../prisma.service';
import { BitlyRepository } from '../repositories/bitly/bitly.repository';
import { AutoMessageRepository } from '../repositories/teatisDB/autoMessage/autoMessage.repository';
import { CoachRepository } from '../repositories/teatisDB/coach/coach.repository';
import { CustomerGeneralRepository } from '../repositories/teatisDB/customer/customerGeneral.repository';
import { TwilioRepository } from '../repositories/twilio/twilio.repository';
import { SendAutoMessageUsecase } from '../usecases/twilio/sendAutoMessage.usecase';
import { SendAutoMessageService } from './twilio/sendAutoMessage.service';

@Module({
  // exports: [StandAloneService],
  providers: [
    SendAutoMessageService,
    PrismaService,
    Logger,
    {
      provide: 'TwilioClient',
      useFactory: () => {
        return new Twilio( process.env.TWILIO_ACCOUNT_SID,
          process.env.TWILIO_AUTH_TOKEN,);
      },
    },
    {
      provide: 'BitlyRepositoryInterface',
      useClass: BitlyRepository,
    },
    {
      provide: 'AutoMessageRepositoryInterface',
      useClass: AutoMessageRepository,
    },
    {
      provide: 'SendAutoMessageUsecaseInterface',
      useClass: SendAutoMessageUsecase,
    },
    {
      provide: 'CoachRepositoryInterface',
      useClass: CoachRepository,
    },
    {
      provide: 'TwilioRepositoryInterface',
      useClass: TwilioRepository,
    },
    {
      provide: 'CustomerGeneralRepositoryInterface',
      useClass: CustomerGeneralRepository,
    },

  ],
})
export class WorkerModule {}
