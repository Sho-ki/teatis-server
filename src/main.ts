// eslint-disable-next-line @typescript-eslint/no-var-requires
const newrelic = require('newrelic');
// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();

/**
 * @param {*} shim DatastoreShim object
 * @param {import("@prisma/client")} prisma6666
 *
 * @see https://newrelic.github.io/node-newrelic/docs/DatastoreShim.html
 */
const instrumentPrisma = (shim, prisma) => {
  // Here you can set the string that will be displayed on New Relic. You can also set an arbitrary string.
  shim.setDatastore(shim.POSTGRES);
  shim.recordQuery(prisma.PrismaClient.prototype, '_executeRequest', {
    query: (_shim, _fn, _name, args) => {
      const params = args[0];
      const query = {
        collection: params.model,
        operation: params.action,
        // Retrieve information that may be substituted for SQL
        query: `${params.clientMethod} ${JSON.stringify(params.args)}`,
      };
      return JSON.stringify(query);
    },
    // Specify to have the information recorded as database information on New Relic.
    record: true,
    // Since _executeRequest is an asynchronous function, it is specified.
    promise: true,
  });

  shim.setParser((query) => {
    return JSON.parse(query);
  });
};

if (process.env.ENV === 'production') {
  newrelic.instrumentDatastore('@prisma/client', instrumentPrisma);
}

import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as Sentry from '@sentry/node';
import { NewrelicInterceptor } from './newrelic.interceptor';

async function bootstrap() {

  const app = await NestFactory.create(AppModule, { cors: true });
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  Sentry.init({ dsn: process.env.SENTRY_DSN });
  app.useGlobalPipes(
    new ValidationPipe({ whitelist: true }),
  );
  if (process.env.ENV === 'production') {
    app.useGlobalInterceptors(new NewrelicInterceptor());
  }
  await app.listen(process.env.PORT || 8080);
}
bootstrap();
