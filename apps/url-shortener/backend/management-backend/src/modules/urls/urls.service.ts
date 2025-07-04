import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Request, Response } from 'express';
import { Repository } from 'typeorm';
import { generateShortId } from '../../utils';
import { CampaignEntity } from '../campaigns/entities/campaign.entity';
import { CreateUrlDto } from './dto/create-url.dto';
import { UrlEntity } from './entities/url.entity';

@Injectable()
export class UrlsService {
  private static readonly MILLISECONDS_IN_MINUTE = 60 * 1000;

  constructor(
    @InjectRepository(UrlEntity)
    private readonly repository: Repository<UrlEntity>,
    @InjectRepository(CampaignEntity)
    private readonly campaignRepository: Repository<CampaignEntity>,
  ) {}

  async create(dto: CreateUrlDto, req: Request) {
    const shortId = await generateShortId(this.repository);
    const shortenedUrl = `https://${req.get('host')}/${shortId}`;

    if (dto.campaignUuid) {
      const campaign = await this.campaignRepository.findOneBy({ uuid: dto.campaignUuid });
      if (!campaign) throw new NotFoundException('Campaign does not exist.');
    }

    const url = this.repository.create({
      shortId,
      shortenedUrl,
      originalUrl: dto.url,
      description: dto.description,
      expirationTimeInMinutes: dto.expirationTimeInMinutes,
      campaign: { uuid: dto.campaignUuid },
    });

    return await this.repository.save(url);
  }

  async findOne(shortId: string, res: Response) {
    const urlExists = await this.repository.findOne({ where: { shortId }, relations: ['campaign'] });
    if (!urlExists) throw new NotFoundException('Url does not exist.');

    if (urlExists.expirationTimeInMinutes) {
      const expirationInMilliseconds = new Date(
        urlExists.createdAt.getTime() + urlExists.expirationTimeInMinutes * UrlsService.MILLISECONDS_IN_MINUTE,
      );

      if (new Date() > expirationInMilliseconds && !urlExists.campaign) await this.repository.remove(urlExists);
      if (new Date() > expirationInMilliseconds) throw new NotFoundException('Url does not exist.');
    }

    this.repository.merge(urlExists, { clicks: urlExists.clicks + 1 });
    await this.repository.save(urlExists);
    return res.redirect(urlExists.originalUrl);
  }
}
