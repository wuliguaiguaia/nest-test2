import { NextFunction, Request, Response } from 'express';
import * as cls from 'cls-hooked';
import * as config from 'config';
import { WinstonLogger } from 'nest-winston';
import winston from 'winston';
import { Injectable, NestMiddleware, Logger } from '@nestjs/common';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private logger = Logger;
  use(req: Request, res: Response, next: NextFunction) {
    next();
  }
}
