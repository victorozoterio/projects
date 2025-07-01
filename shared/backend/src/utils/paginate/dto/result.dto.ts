import { ApiProperty } from '@nestjs/swagger';

export class MetaResultDto {
  @ApiProperty()
  itemsPerPage: number;

  @ApiProperty()
  totalItems: number;

  @ApiProperty()
  currentPage: number;

  @ApiProperty()
  totalPages: number;

  @ApiProperty()
  sortBy: Record<string, string>;

  @ApiProperty()
  searchBy: [];

  @ApiProperty()
  search: string;

  @ApiProperty()
  select: string[];

  @ApiProperty()
  filter?: {
    [column: string]: string | string[];
  };
}

export class Links {
  @ApiProperty()
  first?: string;

  @ApiProperty()
  previous?: string;

  @ApiProperty()
  current: string;

  @ApiProperty()
  next?: string;

  @ApiProperty()
  last?: string;
}

export class ResultPaginateDto {
  @ApiProperty({ type: MetaResultDto })
  meta: MetaResultDto;

  @ApiProperty({ type: Links })
  links: Links;
}
