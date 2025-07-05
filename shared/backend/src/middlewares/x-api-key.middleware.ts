import { Environments } from '@projects/shared/backend';
import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class XApiKeyMiddleware implements NestMiddleware {
  async use(req: Request, _res: Response, next: NextFunction) {
    if (process.env.NODE_ENV !== Environments.DEV && req.headers['x-api-key'] !== process.env.X_API_KEY) {
      throw new UnauthorizedException('Invalid x-api-key.');
    }

    next();
  }
}
