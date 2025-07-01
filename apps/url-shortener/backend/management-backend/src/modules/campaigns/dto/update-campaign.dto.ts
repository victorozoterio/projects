import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateCampaignDto {
	@IsOptional()
	@IsString()
	@ApiProperty()
	name: string;
}
