import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as Sentry from '@sentry/node';
import { WebhookEventModule } from './controllers/systemCron/webhookEvent/webhookEvent.module';
import { WebhookEventService } from './controllers/systemCron/webhookEvent/webhookEvent.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  Sentry.init({ dsn: process.env.SENTRY_DSN });
  app.useGlobalPipes(
    new ValidationPipe({ whitelist: true }),
  );
  app.select(WebhookEventModule).get(WebhookEventService, { strict: true });

  await app.listen(process.env.PORT || 8080);
}
bootstrap();
