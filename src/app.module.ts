import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DiscoveriesModule } from './controllers/discoveries/discoveries.module';
import { PractitionerBoxModule } from './controllers/discoveries/practitioner-box/practitionerBox.module';
import { PractitionerModule } from './controllers/discoveries/practitioner/practitioner.module';
import { ShipheroKeyModule } from './controllers/system/shipheroKey.module';
import { PrismaService } from './prisma.service';

@Module({
  imports: [
    DiscoveriesModule,
    ShipheroKeyModule,
    PractitionerModule,
    PractitionerBoxModule,
  ],

  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
