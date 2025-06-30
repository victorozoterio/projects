import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiExcludeController, ApiOperation } from '@nestjs/swagger';

@Controller('healthz')
@ApiExcludeController()
export class HealthzController {
  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Retrieves information about server health.' })
  findAll() {
    return { status: 'ok' };
  }
}
