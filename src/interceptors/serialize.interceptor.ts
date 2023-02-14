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

interface ClassConstructor {
  new (...args: any[]): {};
}

function removeTimestampProperties(obj) {
  const hasOwnProperty = Object.prototype.hasOwnProperty;
  for (const key in obj) {
    if (hasOwnProperty.call(obj, key)) {
      if (key === 'createdAt' || key === 'updatedAt') {
        delete obj[key];
      } else if (typeof obj[key] === 'object') {
        removeTimestampProperties(obj[key]);
      }
    }
  }

  return obj;
}

type SerializeType= {
  dto?:ClassConstructor;
  timestamp?:boolean;
};
export function Serialize({ dto, timestamp = false }:SerializeType) {
  return UseInterceptors(new SerializeInterceptor(dto, timestamp));
}

export class SerializeInterceptor implements NestInterceptor {
  timestamp: boolean;
  constructor(private dto: any, timestamp:boolean) {
    this.timestamp = timestamp;
  }

  intercept(context: ExecutionContext, handler: CallHandler): Observable<any> {
    return handler.handle().pipe(
      map((data: any) => {
        if(this.timestamp){
          return plainToInstance(this.dto, data, { excludeExtraneousValues: true });
        }
        return removeTimestampProperties(plainToInstance(this.dto, data, { excludeExtraneousValues: true }));
      }),
    );
  }
}
