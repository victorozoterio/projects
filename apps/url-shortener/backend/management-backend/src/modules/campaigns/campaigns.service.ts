import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCampaignDto } from './dto/create-campaign.dto';
import { UpdateCampaignDto } from './dto/update-campaign.dto';
import { CampaignEntity } from './entities/campaign.entity';

@Injectable()
export class CampaignsService {
  constructor(
    @InjectRepository(CampaignEntity)
    private readonly repository: Repository<CampaignEntity>,
  ) {}

  async create(dto: CreateCampaignDto) {
    const campaignAlreadyExists = await this.repository.findOneBy({ name: dto.name });
    if (campaignAlreadyExists) throw new ConflictException('Campaign already exists.');
    const campaign = this.repository.create(dto);
    return this.repository.save(campaign);
  }

  async findAll() {
    return this.repository.find();
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
