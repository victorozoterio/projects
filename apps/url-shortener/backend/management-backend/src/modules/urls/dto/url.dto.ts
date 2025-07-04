import { ApiProperty } from '@nestjs/swagger';

export class UrlResponseDto {
  @ApiProperty()
  shortId: string;

  @ApiProperty()
  clicks: number;

  @ApiProperty()
  originalUrl: string;

  @ApiProperty()
  shortenedUrl: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  expirationTimeInMinutes: number;

  @ApiProperty()
  createdAt: Date;
}
