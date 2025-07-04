import { PaginateModule } from '@projects/shared/backend';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CampaignsController } from './campaigns.controller';
import { CampaignsService } from './campaigns.service';
import { CampaignEntity } from './entities/campaign.entity';
import { UrlEntity } from '../urls/entities/url.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CampaignEntity, UrlEntity]), PaginateModule],
  controllers: [CampaignsController],
  providers: [CampaignsService],
})
export class CampaignsModule {}
