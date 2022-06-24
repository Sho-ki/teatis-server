import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DiscoveriesModule } from '@Controllers/discoveries/discoveries.module';
import { ProductModule } from '@Controllers/ops/product/product.module';
import { ShipheroKeyModule } from '@Controllers/system/shipheroKey.module';
import { PrismaService } from './prisma.service';

@Module({
  imports: [DiscoveriesModule, ShipheroKeyModule, ProductModule],

  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
