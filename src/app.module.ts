import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DiscoveriesModule } from './controllers/discoveries/discoveries.module';
import { ShipheroKeyModule } from './controllers/system/shipheroKey.module';
import { PrismaService } from './prisma.service';

@Module({
  imports: [DiscoveriesModule, ShipheroKeyModule],

  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
