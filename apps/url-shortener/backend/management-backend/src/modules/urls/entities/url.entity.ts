import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { CampaignEntity } from '../../campaigns/entities/campaign.entity';

@Entity('urls')
export class UrlEntity {
  @PrimaryColumn({ name: 'short_id' })
  shortId: string;

  @Column({ name: 'clicks' })
  clicks: number;

  @Column({ name: 'original_url' })
  originalUrl: string;

  @Column({ name: 'shortened_url' })
  shortenedUrl: string;

  @Column({ name: 'description' })
  description: string;

  @Column({ name: 'expiration_time_in_minutes' })
  expirationTimeInMinutes: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @ManyToOne(
    () => CampaignEntity,
    (campaign) => campaign.urls,
  )
  @JoinColumn({ name: 'campaign_uuid' })
  campaign: CampaignEntity;
}
