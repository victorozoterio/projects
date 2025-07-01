import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateCampaignDto {
  @IsString()
  @ApiProperty()
  name: string;
}
