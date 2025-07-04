import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CampaignEntity } from '../campaigns/entities/campaign.entity';
import { UrlEntity } from './entities/url.entity';
import { UrlsController } from './urls.controller';
import { UrlsService } from './urls.service';

@Module({
  imports: [TypeOrmModule.forFeature([UrlEntity, CampaignEntity])],
  controllers: [UrlsController],
  providers: [UrlsService],
})
export class UrlsModule {}
