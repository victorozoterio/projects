import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CampaignsService } from './campaigns.service';
import { CampaignResponseDto, PaginatedCampaignResponseDto } from './dto/campaign.dto';
import { CreateCampaignDto } from './dto/create-campaign.dto';
import { QueryCampaignDto } from './dto/query-campaign.dto';
import { UpdateCampaignDto } from './dto/update-campaign.dto';

@Controller('campaigns')
@ApiTags('Campaigns')
export class CampaignsController {
  constructor(private readonly campaignsService: CampaignsService) {}

  @Post()
  @ApiOperation({ summary: 'Creates a new campaign in the system.' })
  @ApiResponse({ status: 201, type: CampaignResponseDto })
  async create(@Body() dto: CreateCampaignDto) {
    return await this.campaignsService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Retrieves information about all campaigns.' })
  @ApiResponse({ status: 200, type: PaginatedCampaignResponseDto, isArray: true })
  async findAll(@Query() query: QueryCampaignDto) {
    return await this.campaignsService.findAll(query);
  }

  @Put(':uuid')
  @ApiOperation({ summary: 'Updates information of an existing campaign.' })
  @ApiResponse({ status: 200, type: CampaignResponseDto })
  async update(@Param('uuid', new ParseUUIDPipe()) uuid: string, @Body() dto: UpdateCampaignDto) {
    return await this.campaignsService.update(uuid, dto);
  }

  @Delete(':uuid')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Deletes a campaign from the system.' })
  async remove(@Param('uuid', new ParseUUIDPipe()) uuid: string) {
    return await this.campaignsService.remove(uuid);
  }
}
