import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { WeeklyCheckinController } from './weeklyCheckin.controller';

@Module({
  controllers: [WeeklyCheckinController],
  providers: [PrismaService],
  exports: [WeeklyCheckinController],
})
export class PrePurchaseSurveyModule {}
