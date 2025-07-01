import { ResultPaginateDto } from '@projects/shared/backend';
import { ApiProperty } from '@nestjs/swagger';

export class CampaignResponseDto {
  @ApiProperty()
  uuid: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}

export class PaginatedCampaignResponseDto extends ResultPaginateDto {
  @ApiProperty({ type: CampaignResponseDto })
  data: CampaignResponseDto;
}
