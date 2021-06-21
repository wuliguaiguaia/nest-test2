/**
 * 响应拦截器
 * 注：为所有http请求增加日志
 */

import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { ApiErrorCode, ApiErrorMap } from './../exceptions/api.code.enum';

export interface Response<T> {
  start: number;
  end: number;
  spend: number;
  data: T;
  errNo: number;
  errStr: string;
}

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, Response<T>> {
  constructor(private readonly logger: Logger) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response<T>> {
    const start = Date.now();
    const errNo = ApiErrorCode.SUCCESS;

    const req: Request = context.switchToHttp().getRequest();
    const { url, method, query, body } = req;

    return next.handle().pipe(
      map((data) => ({
        start,
        end: Date.now(),
        spend: Date.now() - start,
        errNo,
        data,
        errStr: ApiErrorMap[errNo],
      })),
      tap((data) => {
        const msg = { url, method, query, body, data };
        this.logger.log(msg);
      }),
    );
  }
}
