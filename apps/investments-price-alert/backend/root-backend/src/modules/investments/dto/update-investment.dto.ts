import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsOptional } from 'class-validator';
import { InvestimentCategory } from '../../../utils';

export class UpdateInvestmentDto {
  @IsOptional()
  @IsEnum(InvestimentCategory)
  @ApiProperty({ enum: InvestimentCategory })
  category?: InvestimentCategory;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @ApiProperty()
  desiredPurchaseValue?: number;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @ApiProperty()
  desiredSalesPrice?: number;
}
