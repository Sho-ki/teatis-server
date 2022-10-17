import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DiscoveriesModule } from '@Controllers/discoveries/discoveries.module';
import { ProductModule } from '@Controllers/ops/product/product.module';
import { PrismaService } from './prisma.service';
import { APP_FILTER } from '@nestjs/core';
import { AllExceptionsFilter } from './filter/allExceptions.filter';
import { TerraModule } from './controllers/terra/terra.module';
import { ShipheroKeyModule } from './controllers/systemCron/shipheroKey/shipheroKey.module';
import { WebhookEventModule } from './controllers/systemCron/webhookEvent/webhookEvent.module';
// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();

@Module({
  imports: [
    DiscoveriesModule,
    ShipheroKeyModule,
    WebhookEventModule,
    ProductModule,
    TerraModule,
    ScheduleModule.forRoot(),
  ],

  controllers: [AppController],
  providers: [
    AppService,
    PrismaService,
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
  ],
})
export class AppModule {}
