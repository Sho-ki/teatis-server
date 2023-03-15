import { Logger, Module } from '@nestjs/common';
import { Twilio } from 'twilio';
import { PrismaService } from '../prisma.service';
import { BitlyRepository } from '../repositories/bitly/bitly.repository';
import { GoogleCalendarRepository } from '../repositories/googleOAuth2/googleCalendar.repository';
import { ShipheroRepository } from '../repositories/shiphero/shiphero.repository';
import { ShopifyRepository } from '../repositories/shopify/shopify.repository';
import { AutoMessageRepository } from '../repositories/teatisDB/autoMessage/autoMessage.repository';
import { CoachRepository } from '../repositories/teatisDB/coach/coach.repository';
import { CustomerAuthRepository } from '../repositories/teatisDB/customer/customerAuth.repository';
import { CustomerPreferenceRepository } from '../repositories/teatisDB/customer/customerPreference.repository';
import { CustomerSessionRepository } from '../repositories/teatisDB/customer/customerSession.repository';
import { CustomerEventLogRepository } from '../repositories/teatisDB/customerEventLog/customerEventLog.repository';
import { MonthlySelectionRepository } from '../repositories/teatisDB/monthlySelection/monthlySelection.repository';
import { CronMetaDataRepository } from '../repositories/teatisDB/webhookEvent/cronMetaData.repository';
import { WebhookEventRepository } from '../repositories/teatisDB/webhookEvent/webhookEvent.repository';
import { TwilioRepository } from '../repositories/twilio/twilio.repository';
import { TransactionOperator } from '../repositories/utils/transactionOperator';
import { UpdateCustomerOrderUsecase } from '../usecases/customerOrder/updateCustomerOrder.usecase';
import { SendAutoMessageUsecase } from '../usecases/twilio/sendAutoMessage.usecase';
import { CreateCalendarEvent } from '../usecases/utils/createCalendarEvent';
import { CustomerProductsAutoSwap } from '../usecases/utils/customerProductsAutoSwap';
import { UpdateOrderService } from './updateOrder/updateOrder.service';
import { SendAutoMessageService } from './sendAutoMessage/sendAutoMessage.service';
import { CreateEmployeeOrderService } from './createEmployeeOrder/createEmployeeOrder.service';
import { CreateEmployeeOrderUsecase } from '../usecases/employeeOrder/createEmployeeOrder.usecase';
import { EmployeeRepository } from '../repositories/teatisDB/employee/employee.repository';
import { CustomerGeneralRepository } from '../repositories/teatisDB/customer/customerGeneral.repository';
import { ProductGeneralRepository } from '../repositories/teatisDB/product/productGeneral.repository';
import { CreateCustomerConversationSummary } from './createCustomerConversationSummary/createCustomerConversationSummary.service';

@Module({
  exports: [WorkerModule],
  providers: [
    SendAutoMessageService,
    UpdateOrderService,
    CreateEmployeeOrderService,
    PrismaService,
    CreateCustomerConversationSummary,
    Logger,
    {
      provide: 'TwilioClient',
      useFactory: () => {
        return new Twilio( process.env.TWILIO_ACCOUNT_SID,
          process.env.TWILIO_AUTH_TOKEN,);
      },
    },
    {
      provide: 'ProductGeneralRepositoryInterface',
      useClass: ProductGeneralRepository,
    },
    {
      provide: 'CustomerGeneralRepositoryInterface',
      useClass: CustomerGeneralRepository,
    },
    {
      provide: 'EmployeeRepositoryInterface',
      useClass: EmployeeRepository,
    },
    {
      provide: 'CreateEmployeeOrderUsecaseInterface',
      useClass: CreateEmployeeOrderUsecase,
    },
    {
      provide: 'CustomerEventLogRepositoryInterface',
      useClass: CustomerEventLogRepository,
    },
    {
      provide: 'TransactionOperatorInterface',
      useClass: TransactionOperator,
    },
    {
      provide: 'CronMetaDataRepositoryInterface',
      useClass: CronMetaDataRepository,
    },
    {
      provide: 'MonthlySelectionRepositoryInterface',
      useClass: MonthlySelectionRepository,
    },
    {
      provide: 'GoogleCalendarRepositoryInterface',
      useClass: GoogleCalendarRepository,
    },
    {
      provide: 'CreateCalendarEventInterface',
      useClass: CreateCalendarEvent,
    },
    {
      provide: 'CustomerAuthRepositoryInterface',
      useClass: CustomerAuthRepository,
    },
    {
      provide: 'CustomerSessionRepositoryInterface',
      useClass: CustomerSessionRepository,
    },
    {
      provide: 'WebhookEventRepositoryInterface',
      useClass: WebhookEventRepository,
    },
    {
      provide: 'CustomerProductsAutoSwapInterface',
      useClass: CustomerProductsAutoSwap,
    },
    {
      provide: 'UpdateCustomerOrderUsecaseInterface',
      useClass: UpdateCustomerOrderUsecase,
    },
    {
      provide: 'CustomerPreferenceRepositoryInterface',
      useClass: CustomerPreferenceRepository,
    },
    {
      provide: 'ShipheroRepositoryInterface',
      useClass: ShipheroRepository,
    },
    {
      provide: 'ShopifyRepositoryInterface',
      useClass: ShopifyRepository,
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

  ],
})
export class WorkerModule {}
