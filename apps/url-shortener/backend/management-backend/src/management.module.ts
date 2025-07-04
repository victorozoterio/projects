import { Module } from '@nestjs/common';
import { CampaignsModule } from './modules/campaigns/campaigns.module';
import { UrlsModule } from './modules/urls/urls.module';

@Module({
  imports: [CampaignsModule, UrlsModule],
  controllers: [],
  providers: [],
})
export class ManagementModule {}
