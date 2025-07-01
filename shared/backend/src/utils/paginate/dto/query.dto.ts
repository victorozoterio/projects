import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsNumber, IsOptional } from 'class-validator';
import { PaginateQuery } from 'nestjs-paginate';

export class QueryDto implements PaginateQuery {
  path = '/';

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @ApiPropertyOptional({ description: 'Page number', default: 1 })
  page?: number = 1;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @ApiPropertyOptional({ description: 'Number of items per page', default: 10 })
  limit?: number = 10;

  @IsOptional()
  @Transform(({ value }) => {
    const parsedValue = JSON.parse(value);
    return [parsedValue];
  })
  @ApiPropertyOptional({
    description: 'Field to sort by',
    type: 'string',
    items: {
      type: 'array',
      items: {
        type: 'string',
      },
    },
    default: ['createdAt', 'DESC'],
  })
  sortBy?: [string, string][] = [['createdAt', 'DESC']];
}
