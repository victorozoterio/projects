import { Column, CreateDateColumn, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { UserEntity } from '../../users/entities/user.entity';

@Entity('tokens')
export class TokenEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'uuid' })
  uuid: string;

  @Column({ name: 'token' })
  token: number;

  @Column({ name: 'type' })
  type: string;

  @Column({ name: 'expires_at', nullable: true })
  expiresAt?: Date;

  @OneToOne(() => UserEntity)
  @JoinColumn({ name: 'user_uuid' })
  userUuid: UserEntity;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
