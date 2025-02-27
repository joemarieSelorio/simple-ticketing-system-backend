import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Response as ExpressResponse } from 'express';

interface Response<T> {
  status: number;
  message: string;
  timestamp: string;
}

@Injectable()
export class TransformResponseInterceptor<T>
  implements NestInterceptor<T, Response<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response<T>> {
    return next.handle().pipe(
      map((data: T) => ({
        ...data,
        status: context.switchToHttp().getResponse<ExpressResponse>()
          .statusCode,
        message: 'Success',
        timestamp: new Date().toISOString(),
      })),
    );
  }
}
