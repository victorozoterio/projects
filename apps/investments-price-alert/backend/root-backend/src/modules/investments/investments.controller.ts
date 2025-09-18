import { BearerAuthGuard, UserDecorator } from '@projects/shared/backend';
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  ParseUUIDPipe,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { InvestmentsService } from './investments.service';
import { CreateInvestmentDto } from './dto/create-investment.dto';
import { UserEntity } from '../users/entities/user.entity';
import { ApiBearerAuth, ApiHeaders, ApiOperation, ApiResponse, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { InvestmentResponseDto } from './dto/investment.dto';
import { UpdateInvestmentDto } from './dto/update-investment.dto';

ApiSecurity('x-api-key');
@ApiBearerAuth('bearer-token')
@UseGuards(BearerAuthGuard)
@ApiTags('Investments')
@Controller('investments')
export class InvestmentsController {
  constructor(private readonly investmentsService: InvestmentsService) {}

  @Post()
  @ApiHeaders([{ name: 'User-Uuid', required: true }])
  @ApiOperation({ summary: 'Creates a new investment in the system.' })
  @ApiResponse({ status: 201, description: 'Returns the investment created.' })
  async create(@Body() createInvestimentDto: CreateInvestmentDto, @UserDecorator() user: UserEntity) {
    return this.investmentsService.create(createInvestimentDto, user);
  }

  @Get()
  @ApiHeaders([{ name: 'User-Uuid', required: true }])
  @ApiOperation({ summary: 'Retrieves information about all investments of the user.' })
  @ApiResponse({ status: 200, type: InvestmentResponseDto, isArray: true })
  async findAllByUser(@UserDecorator() user: UserEntity) {
    return await this.investmentsService.findAllByUser(user);
  }

  @Get('run-alerts')
  @ApiOperation({ summary: 'Runs the investments price alerts.' })
  @ApiResponse({ status: 200 })
  async runInvestmentAlerts() {
    return await this.investmentsService.runInvestmentAlerts();
  }

  @Put(':uuid')
  @ApiHeaders([{ name: 'User-Uuid', required: true }])
  @ApiOperation({ summary: 'Updates information of an existing investment.' })
  @ApiResponse({ status: 200, type: InvestmentResponseDto })
  async update(
    @Param('uuid', new ParseUUIDPipe()) uuid: string,
    @Body() dto: UpdateInvestmentDto,
    @UserDecorator() user: UserEntity,
  ) {
    return await this.investmentsService.update(uuid, dto, user);
  }

  @Delete(':uuid')
  @ApiHeaders([{ name: 'User-Uuid', required: true }])
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Deletes a investment from the system.' })
  async remove(@Param('uuid', new ParseUUIDPipe()) uuid: string) {
    return await this.investmentsService.remove(uuid);
  }
}
