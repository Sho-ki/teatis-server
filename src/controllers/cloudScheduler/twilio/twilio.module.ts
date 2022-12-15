import { Module } from '@nestjs/common';
import { TwilioController } from './twilio.controller';

@Module({
  controllers: [TwilioController],
  exports: [TwilioController],
  providers: [TwilioController],
})
export class TwilioModule {}
