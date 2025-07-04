import { PaginateService } from '@projects/shared/backend';
import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { CreateCampaignDto } from './dto/create-campaign.dto';
import { QueryCampaignDto } from './dto/query-campaign.dto';
import { UpdateCampaignDto } from './dto/update-campaign.dto';
import { CampaignEntity } from './entities/campaign.entity';
import { UrlEntity } from '../urls/entities/url.entity';

@Injectable()
export class CampaignsService {
  constructor(
    private readonly paginateService: PaginateService,
    @InjectRepository(CampaignEntity)
    private readonly repository: Repository<CampaignEntity>,
    @InjectRepository(UrlEntity)
    private readonly urlRepository: Repository<UrlEntity>,
  ) {}

  async create(dto: CreateCampaignDto) {
    const campaignAlreadyExists = await this.repository.findOneBy({ name: dto.name });
    if (campaignAlreadyExists) throw new ConflictException('Campaign already exists.');
    const campaign = this.repository.create(dto);
    return this.repository.save(campaign);
  }

  async findAll(query: QueryCampaignDto) {
    const keyMap = { name: (value: string) => ({ name: ILike(`%${value}%`) }) };

    return this.paginateService.paginate({
      query,
      keyMap,
      repository: this.repository,
      where: {},
    });
  }

  async getMetrics(uuid: string) {
    const campaign = await this.repository.findOneBy({ uuid });
    if (!campaign) throw new NotFoundException('Campaign does not exist.');

    const urls = await this.urlRepository.find({ where: { campaign: { uuid } } });
    const clicks = urls.reduce((sum, url) => sum + url.clicks, 0);
    return { clicks, createdAt: campaign.createdAt };
  }

  async update(uuid: string, dto: UpdateCampaignDto) {
    const campaign = await this.repository.findOneBy({ uuid });
    if (!campaign) throw new NotFoundException('Campaign does not exist.');
    this.repository.merge(campaign, dto);
    return this.repository.save(campaign);
  }

  async remove(uuid: string) {
    const campaign = await this.repository.findOneBy({ uuid });
    if (!campaign) throw new NotFoundException('Campaign does not exist.');
    return this.repository.delete({ uuid });
  }
}
