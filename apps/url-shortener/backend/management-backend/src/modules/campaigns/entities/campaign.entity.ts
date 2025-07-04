import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { UrlEntity } from '../../urls/entities/url.entity';

@Entity('campaigns')
export class CampaignEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'uuid' })
  uuid: string;

  @Column({ name: 'name' })
  name: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @OneToMany(
    () => UrlEntity,
    (urls) => urls.campaign,
  )
  urls: UrlEntity[];
}
