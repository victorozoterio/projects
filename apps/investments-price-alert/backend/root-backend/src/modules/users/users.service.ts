import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UserEntity } from './entities/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly repository: Repository<UserEntity>,
  ) {}

  async create(dto: CreateUserDto) {
    const createdUser = this.repository.create(dto);
    return await this.repository.save(createdUser);
  }

  async findByEmail(email: string) {
    return await this.repository.findOneBy({ email });
  }
}
