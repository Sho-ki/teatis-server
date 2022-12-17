import { NestFactory } from '@nestjs/core';
import { StandAloneModule } from '../standAlone.module';
import { SendAutoMessageService } from './sendAutoMessage.service';

// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();

const sendAutoMessage = async() => {
  const standAloneApp = await NestFactory.createApplicationContext(StandAloneModule);
  const appService = standAloneApp.get(SendAutoMessageService);
  appService.sendAutoMessage();
  await standAloneApp.close();

};

sendAutoMessage();
