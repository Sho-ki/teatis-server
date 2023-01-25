import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DiscoveriesModule } from '@Controllers/discoveries/discoveries.module';
import { ProductModule } from '@Controllers/ops/product/product.module';
import { PrismaService } from './prisma.service';
import { APP_FILTER } from '@nestjs/core';
import { AllExceptionsFilter } from './filter/allExceptions.filter';
import { TerraModule } from '@Controllers/terra/terra.module';
import { ShipheroKeyModule } from '@Controllers/cloudScheduler/shipheroKey/shipheroKey.module';
import { OAuth2Module } from '@Controllers/oAuth2/oAuth2.module';
import { SubscriptionModule } from '@Controllers/recharge/subscription.module';
import { CoachingModule } from '@Controllers/twilio/coaching/coaching.module';
import { MonthlyProductsModule } from '@Controllers/discoveries/monthlyProducts/monthlyProducts.module';

@Module({
  imports: [
    DiscoveriesModule,
    ShipheroKeyModule,
    SubscriptionModule,
    ProductModule,
    TerraModule,
    OAuth2Module,
    CoachingModule,
    MonthlyProductsModule,
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
