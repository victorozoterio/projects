import { PaginateService } from '@projects/shared/backend';
import { ConflictException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { CreateCampaignDto } from './dto/create-campaign.dto';
import { QueryCampaignDto } from './dto/query-campaign.dto';
import { UpdateCampaignDto } from './dto/update-campaign.dto';
import { CampaignEntity } from './entities/campaign.entity';
import { UrlEntity } from '../urls/entities/url.entity';

@Injectable()
export class CampaignsService {
  private readonly logger = new Logger(CampaignsService.name);

  constructor(
    private readonly paginateService: PaginateService,
    @InjectRepository(CampaignEntity)
    private readonly repository: Repository<CampaignEntity>,
    @InjectRepository(UrlEntity)
    private readonly urlRepository: Repository<UrlEntity>,
  ) {}

  async create(dto: CreateCampaignDto) {
    this.logger.log('Starting create campaign process');

    try {
      const campaignAlreadyExists = await this.repository.findOneBy({ name: dto.name });
      if (campaignAlreadyExists) throw new ConflictException('Campaign already exists.');

      const campaign = this.repository.create(dto);
      const savedCampaign = await this.repository.save(campaign);

      this.logger.log('Campaign created successfully');
      return savedCampaign;
    } catch (err) {
      this.logger.error(
        `Error creating campaign (DTO: ${JSON.stringify(dto)}) - Error: ${err.message ? err.message : JSON.stringify(err)}`,
        err.stack,
      );
      throw err;
    }
  }

  async findAll(query: QueryCampaignDto) {
    this.logger.log('Starting find all campaigns process');

    try {
      const keyMap = { name: (value: string) => ({ name: ILike(`%${value}%`) }) };

      const result = await this.paginateService.paginate({
        query,
        keyMap,
        repository: this.repository,
        where: {},
      });

      this.logger.log('Campaigns found successfully');
      return result;
    } catch (err) {
      this.logger.error(
        `Error fetching campaigns (Query: ${JSON.stringify(query)}) - Error: ${err.message ? err.message : JSON.stringify(err)}`,
        err.stack,
      );
      throw err;
    }
  }

  async getMetrics(uuid: string) {
    this.logger.log(`Starting get campaign metrics process (UUID: ${uuid})`);

    try {
      const campaign = await this.repository.findOneBy({ uuid });
      if (!campaign) throw new NotFoundException('Campaign does not exist.');

      const urls = await this.urlRepository.find({ where: { campaign: { uuid } } });
      const clicks = urls.reduce((sum, url) => sum + url.clicks, 0);

      this.logger.log('Campaign metrics retrieved successfully');
      return { clicks, createdAt: campaign.createdAt };
    } catch (err) {
      this.logger.error(
        `Error retrieving campaign metrics (UUID: ${uuid}) - Error: ${err.message ? err.message : JSON.stringify(err)}`,
        err.stack,
      );
      throw err;
    }
  }

  async update(uuid: string, dto: UpdateCampaignDto) {
    this.logger.log(`Starting update campaign process (UUID: ${uuid})`);

    try {
      const campaign = await this.repository.findOneBy({ uuid });
      if (!campaign) throw new NotFoundException('Campaign does not exist.');

      this.repository.merge(campaign, dto);
      const updatedCampaign = await this.repository.save(campaign);

      this.logger.log('Campaign updated successfully');
      return updatedCampaign;
    } catch (err) {
      this.logger.error(
        `Error updating campaign (UUID: ${uuid}, DTO: ${JSON.stringify(dto)}) - Error: ${err.message ? err.message : JSON.stringify(err)}`,
        err.stack,
      );
      throw err;
    }
  }

  async remove(uuid: string) {
    this.logger.log(`Starting remove campaign process (UUID: ${uuid})`);

    try {
      const campaign = await this.repository.findOneBy({ uuid });
      if (!campaign) throw new NotFoundException('Campaign does not exist.');

      await this.repository.delete({ uuid });

      this.logger.log('Campaign removed successfully');
      return { message: 'Campaign removed successfully.' };
    } catch (err) {
      this.logger.error(
        `Error removing campaign (UUID: ${uuid}) - Error: ${err.message ? err.message : JSON.stringify(err)}`,
        err.stack,
      );
      throw err;
    }
  }
}
