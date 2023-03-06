import { Module } from '@nestjs/common';
import { OAuth2Controller } from './oAuth2.controller';
import { PrismaService } from '../../prisma.service';
import { StoreCustomerTokenUsecase } from '@Usecases/auth/google/storeCustomerToken.usecase';
import { CreateCalendarEvent } from '@Usecases/utils/createCalendarEvent';
import { CheckHasValidTokenUsecase } from '@Usecases/auth/google/checkHasValidToken.usecase';
import { GetCustomerBySessionIdUsecase } from '@Usecases/auth/google/getCustomerBySessionId.usecase';
import { GetOAuthUriUsecase } from '@Usecases/auth/google/getOAuthUri.usecase';

@Module({
  controllers: [OAuth2Controller],
  exports: [OAuth2Controller],
  providers: [
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
      provide: 'StoreCustomerTokenUsecaseInterface',
      useClass: StoreCustomerTokenUsecase,
    },

    OAuth2Controller,
    PrismaService,
  ],
})
export class OAuth2Module {}
