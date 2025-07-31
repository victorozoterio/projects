import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class CalculatorDto {
  @IsNumber()
  @ApiProperty()
  cashValue: number;

  @IsNumber()
  @ApiProperty()
  installmentValue: number;

  @IsNumber()
  @ApiProperty()
  numberOfInstallments: number;

  @IsNumber()
  @ApiProperty()
  annualSelicRatePercent: number;
}
