import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CustomersModule } from './customers/customers.module';
import { PrismaService } from './prisma.service';

@Module({
  imports: [CustomersModule],

  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
