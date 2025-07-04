import { Body, Controller, Get, Param, Post, Req, Res } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { CreateUrlDto } from './dto/create-url.dto';
import { UrlsService } from './urls.service';
import { UrlResponseDto } from './dto/url.dto';

@Controller('')
@ApiTags('Urls')
export class UrlsController {
  constructor(private readonly urlsService: UrlsService) {}

  @Post()
  @ApiOperation({ summary: 'Creates a new shortened url in the system.' })
  @ApiResponse({ status: 201, type: UrlResponseDto })
  async create(@Body() dto: CreateUrlDto, @Req() req: Request) {
    return this.urlsService.create(dto, req);
  }

  @Get(':shortId')
  @ApiOperation({ summary: 'Redirects to the original url.' })
  @ApiResponse({ status: 200 })
  async findOne(@Param('shortId') shortId: string, @Res() res: Response) {
    return this.urlsService.findOne(shortId, res);
  }
}
