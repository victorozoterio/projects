import { QueryDto } from '@projects/shared/backend';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class QueryCampaignDto extends QueryDto {
  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  name: string;
}
