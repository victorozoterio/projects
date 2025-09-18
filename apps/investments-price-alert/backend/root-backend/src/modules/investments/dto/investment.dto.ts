import { ApiProperty } from '@nestjs/swagger';

export class InvestmentResponseDto {
  @ApiProperty()
  uuid: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  code: string;

  @ApiProperty()
  category: string;

  @ApiProperty()
  desiredPurchaseValue: number;

  @ApiProperty()
  desiredSalesPrice: number;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
