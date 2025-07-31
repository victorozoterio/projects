import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { CalculatorService } from './calculator.service';
import { CalculatorDto } from './dto/calculator.dto';

@ApiSecurity('x-api-key')
@Controller('calculator')
@ApiTags('Calculator')
export class CalculatorController {
  constructor(private readonly calculatorService: CalculatorService) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Calculate whether it is better to pay in cash or in installments.' })
  @ApiResponse({ status: 200, type: CalculatorDto })
  async calculate(@Body() dto: CalculatorDto) {
    return await this.calculatorService.calculate(dto);
  }
}
