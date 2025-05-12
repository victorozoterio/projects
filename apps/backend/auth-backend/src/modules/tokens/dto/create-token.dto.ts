import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsString } from 'class-validator';
import { TokenType } from '../../../utils';

export class CreateTokenDto {
  @IsString()
  @ApiProperty()
  userUuid: string;

  @IsEnum(TokenType)
  @ApiProperty({ enum: TokenType })
  type: TokenType;
}
