import { Module } from '@nestjs/common';
import { OAuth2Controller } from './oAuth2.controller';
import { PrismaService } from '../../prisma.service';
import { CustomerGeneralRepository } from '@Repositories/teatisDB/customer/customerGeneral.repository';
import { CustomerAuthRepository } from '@Repositories/teatisDB/customer/customerAuth.repository';
import { StoreCustomerTokenUsecase } from '@Usecases/auth/google/storeCustomerToken.usecase';
import { GoogleOAuth2Repository } from '@Repositories/googleOAuth2/googleOAuth2.repository';
import { CustomerSessionRepository } from '@Repositories/teatisDB/customer/customerSession.repository';
import { GoogleCalendarRepository } from '@Repositories/googleOAuth2/googleCalendar.repository';
import { ShipheroRepository } from '@Repositories/shiphero/shiphero.repository';
import { CreateCalendarEvent } from '@Usecases/utils/createCalendarEvent';
import { CheckHasValidTokenUsecase } from '@Usecases/auth/google/checkHasValidToken.usecase';

@Module({
  controllers: [OAuth2Controller],
  exports: [OAuth2Controller],
  providers: [
    {
      provide: 'CheckHasValidTokenUsecaseInterface',
      useClass: CheckHasValidTokenUsecase,
    },
    {
      provide: 'CreateCalendarEventInterface',
      useClass: CreateCalendarEvent,
    },
    {
      provide: 'ShipheroRepositoryInterface',
      useClass: ShipheroRepository,
    },
    {
      provide: 'GoogleCalendarRepositoryInterface',
      useClass: GoogleCalendarRepository,
    },
    {
      provide: 'CustomerSessionRepositoryInterface',
      useClass: CustomerSessionRepository,
    },
    {
      provide: 'GoogleOAuth2RepositoryInterface',
      useClass: GoogleOAuth2Repository,
    },
    {
      provide: 'StoreCustomerTokenUsecaseInterface',
      useClass: StoreCustomerTokenUsecase,
    },
    {
      provide: 'CustomerAuthRepositoryInterface',
      useClass: CustomerAuthRepository,
    },
    {
      provide: 'CustomerGeneralRepositoryInterface',
      useClass: CustomerGeneralRepository,
    },

    OAuth2Controller,
    PrismaService,
  ],
})
export class OAuth2Module {}
