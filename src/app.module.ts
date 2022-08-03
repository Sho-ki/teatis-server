import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DiscoveriesModule } from '@Controllers/discoveries/discoveries.module';
import { ProductModule } from '@Controllers/ops/product/product.module';
import { ShipheroKeyModule } from '@Controllers/system/shipheroKey.module';
import { PrismaService } from './prisma.service';
import { APP_FILTER } from '@nestjs/core';
import { AllExceptionsFilter } from './filter/allExceptions.filter';
// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();

@Module({
  imports: [DiscoveriesModule, ShipheroKeyModule, ProductModule],

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
