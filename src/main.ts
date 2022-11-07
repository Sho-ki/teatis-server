/* eslint-disable @typescript-eslint/no-var-requires */
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
import * as session from 'express-session';
import * as createStore from 'connect-pg-simple';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const vercelOrigins = /^https:\/\/(.*)\.vercel\.app\/?$/;
  const app = await NestFactory.create<NestExpressApplication>(
    AppModule,
    {
      cors: {
        origin: ['http://localhost:3000', 'https://app.teatismeal.com', vercelOrigins],
        credentials: true,
      },
    },
  );
  app.set('trust proxy', 1);
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.useGlobalPipes(
    new ValidationPipe({ whitelist: true }),
  );
  if (process.env.ENV === 'production') {
    app.useGlobalInterceptors(new NewrelicInterceptor());
    Sentry.init({ dsn: process.env.SENTRY_DSN });
  }

  const SessionStore = createStore(session);
  const sessionStore = new SessionStore({
    conString: process.env.DATABASE_URL,
    tableName: 'CustomerSessionStore',
  });
  const expiresDate = new Date();
  expiresDate.setFullYear(expiresDate.getFullYear() + 1);
  const pgSimple = session({
    name: 'teatis_session',
    store: sessionStore,
    secret: process.env.COOKIE_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      expires: expiresDate,
      sameSite: 'none',
      secure: true,
    },
  });

  app.use(pgSimple);

  await app.listen(process.env.PORT || 8080);
}
bootstrap();
