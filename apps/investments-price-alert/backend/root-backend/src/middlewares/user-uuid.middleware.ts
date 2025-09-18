import { BadRequestException, Injectable, NestMiddleware, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { NextFunction, Request, Response } from 'express';
import { Repository } from 'typeorm';
import { UserEntity } from '../modules/users/entities/user.entity';

@Injectable()
export class UserUuidMiddleware implements NestMiddleware {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async use(req: Request, _res: Response, next: NextFunction) {
    const userUuid = req.headers['user-uuid']?.slice(0, 36) as string;
    if (!userUuid) {
      throw new BadRequestException('Validation failed (User-Uuid must be a UUID)');
    }

    const user = await this.userRepository.findOneBy({ uuid: userUuid });
    if (!user) throw new NotFoundException('User does not exist.');
    req.user = user;

    next();
  }
}
