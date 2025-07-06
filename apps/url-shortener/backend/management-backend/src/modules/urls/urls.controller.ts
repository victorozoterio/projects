import { JwtAuthGuard } from '@projects/shared/backend';
import { Body, Controller, Get, Param, Post, Req, Res, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { CreateUrlDto } from './dto/create-url.dto';
import { UrlsService } from './urls.service';
import { UrlResponseDto } from './dto/url.dto';

@ApiSecurity('x-api-key')
@ApiBearerAuth('bearer-token')
@Controller('')
@ApiTags('Urls')
export class UrlsController {
  constructor(private readonly urlsService: UrlsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Creates a new shortened url in the system.' })
  @ApiResponse({ status: 201, type: UrlResponseDto })
  async create(@Body() dto: CreateUrlDto, @Req() req: Request) {
    return await this.urlsService.create(dto, req);
  }

  @Get(':shortId')
  @ApiOperation({ summary: 'Redirects to the original url.' })
  @ApiResponse({ status: 200 })
  async findOne(@Param('shortId') shortId: string, @Res() res: Response) {
    return await this.urlsService.findOne(shortId, res);
  }

  @Get(':shortId/metrics')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Retrieves metrics about a specific shortened url.' })
  @ApiResponse({ status: 200 })
  async getMetrics(@Param('shortId') shortId: string) {
    return await this.urlsService.getMetrics(shortId);
  }
}
