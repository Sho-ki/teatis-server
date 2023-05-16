import { Module } from '@nestjs/common';
import { OAuth2Controller } from './oAuth2.controller';
import { PrismaService } from '../../prisma.service';
import { CustomerAuthRepository } from '@Repositories/teatisDB/customer/customerAuth.repository';
import { StoreCustomerTokenUsecase } from '@Usecases/auth/google/storeCustomerToken.usecase';
import { GoogleOAuth2Repository } from '@Repositories/googleOAuth2/googleOAuth2.repository';
import { CustomerSessionRepository } from '@Repositories/teatisDB/customer/customerSession.repository';
import { GoogleCalendarRepository } from '@Repositories/googleOAuth2/googleCalendar.repository';
import { ShipheroRepository } from '@Repositories/shiphero/shiphero.repository';
import { CreateCalendarEvent } from '@Usecases/utils/createCalendarEvent';
import { CheckHasValidTokenUsecase } from '@Usecases/auth/google/checkHasValidToken.usecase';
import { GetCustomerBySessionIdUsecase } from '@Usecases/auth/google/getCustomerBySessionId.usecase';
import { GetOAuthUriUsecase } from '@Usecases/auth/google/getOAuthUri.usecase';
import { CustomerEventLogRepository } from '../../repositories/teatisDB/customerEventLog/customerEventLog.repository';

@Module({
  controllers: [OAuth2Controller],
  exports: [OAuth2Controller],
  providers: [
    {
      provide: 'CustomerEventLogRepositoryInterface',
      useClass: CustomerEventLogRepository,
    },
    {
      provide: 'GetOAuthUriUsecaseInterface',
      useClass: GetOAuthUriUsecase,
    },

    {
      provide: 'GetCustomerBySessionIdUsecaseInterface',
      useClass: GetCustomerBySessionIdUsecase,
    },
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

    OAuth2Controller,
    PrismaService,
  ],
})
export class OAuth2Module {}
