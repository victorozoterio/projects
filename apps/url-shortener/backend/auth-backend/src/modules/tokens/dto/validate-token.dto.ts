import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString, IsStrongPassword } from 'class-validator';

export class ValidateTokenDto {
  @IsString()
  @ApiProperty()
  userUuid: string;

  @IsInt()
  @ApiProperty()
  token: number;

  @IsOptional()
  @IsStrongPassword()
  @ApiProperty()
  password?: string;
}
