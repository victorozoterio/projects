import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsString } from 'class-validator';
import { InvestimentCategory } from '../../../utils';
import { Transform } from 'class-transformer';

export class CreateInvestmentDto {
  @IsString()
  @ApiProperty()
  @Transform(({ value }) => value?.toUpperCase())
  code: string;

  @IsEnum(InvestimentCategory)
  @ApiProperty({ enum: InvestimentCategory })
  category: InvestimentCategory;

  @IsNumber({ maxDecimalPlaces: 2 })
  @ApiProperty()
  desiredPurchaseValue: number;

  @IsNumber({ maxDecimalPlaces: 2 })
  @ApiProperty()
  desiredSalesPrice: number;
}
