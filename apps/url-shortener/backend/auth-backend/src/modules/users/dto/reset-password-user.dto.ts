import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';

export class ResetPasswordUserDto {
  @IsEmail()
  @ApiProperty()
  email: string;
}
