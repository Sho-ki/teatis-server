/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  UseInterceptors,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { plainToInstance } from 'class-transformer';

function removeTimestampProperties(obj) {
  const hasOwnProperty = Object.prototype.hasOwnProperty;
  for (const key in obj) {
    if (hasOwnProperty.call(obj, key)) {
      if (key === 'createdAt' || key === 'updatedAt') {
        delete obj[key];
      } else if (typeof obj[key] === 'object') {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        removeTimestampProperties(obj[key]);
      }
    }
  }

  return obj;
}

// pass removeTimestamps(bool) to the interceptor to remove timestamps from the response
export function Serialize<T>(dto: new () => T, removeTimestamps = true) {
  return UseInterceptors(new SerializeInterceptor(dto, removeTimestamps ));
}

// if removeTimestamps is true, remove timestamps from the response
export class SerializeInterceptor<T> implements NestInterceptor {
  removeTimestamps: boolean;
  constructor(private readonly dto: new () => T, removeTimestamps = true) {
    this.removeTimestamps = removeTimestamps;
  }

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        return plainToInstance(this.dto,
          data, { excludeExtraneousValues: true });
      }),
    );
  }
}
