import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Request, Response } from 'express';
import { Repository } from 'typeorm';
import { generateShortId } from '../../utils';
import { CampaignEntity } from '../campaigns/entities/campaign.entity';
import { CreateUrlDto } from './dto/create-url.dto';
import { UrlEntity } from './entities/url.entity';

@Injectable()
export class UrlsService {
  private readonly logger = new Logger(UrlsService.name);
  private static readonly MILLISECONDS_IN_MINUTE = 60 * 1000;

  constructor(
    @InjectRepository(UrlEntity)
    private readonly repository: Repository<UrlEntity>,
    @InjectRepository(CampaignEntity)
    private readonly campaignRepository: Repository<CampaignEntity>,
  ) {}

  async create(dto: CreateUrlDto, req: Request) {
    this.logger.log('Starting create URL process');

    try {
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

      const savedUrl = await this.repository.save(url);

      this.logger.log('URL created successfully');
      return savedUrl;
    } catch (err) {
      this.logger.error(
        `Error creating URL (DTO: ${JSON.stringify(dto)}) - Error: ${err.message ? err.message : JSON.stringify(err)}`,
        err.stack,
      );
      throw err;
    }
  }

  async findOne(shortId: string, res: Response) {
    this.logger.log(`Starting find URL process (ShortId: ${shortId})`);

    try {
      const url = await this.repository.findOne({ where: { shortId }, relations: ['campaign'] });
      if (!url) throw new NotFoundException('Url does not exist.');

      if (url.expirationTimeInMinutes) {
        const expirationInMilliseconds = new Date(
          url.createdAt.getTime() + url.expirationTimeInMinutes * UrlsService.MILLISECONDS_IN_MINUTE,
        );

        if (new Date() > expirationInMilliseconds && !url.campaign) await this.repository.remove(url);
        if (new Date() > expirationInMilliseconds) throw new NotFoundException('Url does not exist.');
      }

      this.repository.merge(url, { clicks: url.clicks + 1 });
      await this.repository.save(url);

      this.logger.log('URL found and redirected successfully');
      return res.redirect(url.originalUrl);
    } catch (err) {
      this.logger.error(
        `Error finding URL (ShortId: ${shortId}) - Error: ${err.message ? err.message : JSON.stringify(err)}`,
        err.stack,
      );
      throw err;
    }
  }

  async getMetrics(shortId: string) {
    this.logger.log(`Starting get URL metrics process (ShortId: ${shortId})`);

    try {
      const url = await this.repository.findOne({ where: { shortId }, relations: ['campaign'] });
      if (!url) throw new NotFoundException('Url does not exist.');

      let expiratesAt: Date | null = null;
      if (url.expirationTimeInMinutes) {
        expiratesAt = new Date(
          url.createdAt.getTime() + url.expirationTimeInMinutes * UrlsService.MILLISECONDS_IN_MINUTE,
        );
      }

      this.logger.log('URL metrics retrieved successfully');
      return { clicks: url.clicks, createdAt: url.createdAt, expiratesAt };
    } catch (err) {
      this.logger.error(
        `Error retrieving URL metrics (ShortId: ${shortId}) - Error: ${err.message ? err.message : JSON.stringify(err)}`,
        err.stack,
      );
      throw err;
    }
  }
}
