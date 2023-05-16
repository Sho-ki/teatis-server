import { Logger } from '@nestjs/common';
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import * as Sentry from '@sentry/node';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    const { httpAdapter } = this.httpAdapterHost;
    const ctx = host.switchToHttp();
    const request = ctx.getRequest();
    const response = ctx.getResponse();

    const httpStatus =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    if (exception instanceof HttpException) {
      const responseBody = exception.getResponse();
      this.logger.error(
        `Request failed with status ${httpStatus} - ${JSON.stringify(
          responseBody,
        )}`,
      );
      httpAdapter.reply(response, responseBody, httpStatus);
    } else {
      const timestamp = new Date().toISOString();
      const path = httpAdapter.getRequestUrl(request);

      const responseBody = {
        statusCode: httpStatus,
        timestamp,
        path,
      };

      this.logger.error(
        `Request failed with status ${httpStatus} - ${exception}`,
      );

      if (process.env.ENV === 'production') {
        Sentry.captureException(exception);
      }

      httpAdapter.reply(response, responseBody, httpStatus);
    }
  }
}
