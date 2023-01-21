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
import { ShipheroKeyModule } from './controllers/cloudScheduler/shipheroKey/shipheroKey.module';
import { OAuth2Module } from './controllers/oAuth2/oAuth2.module';
import { SubscriptionModule } from './controllers/recharge/subscription.module';
import { CoachingModule } from './controllers/twilio/coaching/coaching.module';

@Module({
  imports: [
    DiscoveriesModule,
    ShipheroKeyModule,
    SubscriptionModule,
    ProductModule,
    TerraModule,
    OAuth2Module,
    CoachingModule,
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
