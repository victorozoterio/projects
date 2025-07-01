import { Module } from '@nestjs/common';
import { CampaignsModule } from './modules/campaigns/campaigns.module';

@Module({
  imports: [CampaignsModule],
  controllers: [],
  providers: [],
})
export class ManagementModule {}
