import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString, IsUUID, IsUrl } from 'class-validator';

export class CreateUrlDto {
  @IsUrl()
  @ApiProperty()
  url: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  description?: string;

  @IsOptional()
  @IsInt()
  @ApiProperty()
  expirationTimeInMinutes?: number;

  @IsOptional()
  @IsUUID()
  @ApiProperty()
  campaignUuid?: string;
}
