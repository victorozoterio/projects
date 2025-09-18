import { Column, CreateDateColumn, Entity, OneToMany, PrimaryColumn, UpdateDateColumn } from 'typeorm';
import { InvestmentEntity } from '../../investments/entities/investment.entity';

@Entity('users')
export class UserEntity {
  @PrimaryColumn('uuid', { name: 'uuid' })
  uuid: string;

  @Column({ name: 'first_name' })
  firstName: string;

  @Column({ name: 'last_name' })
  lastName: string;

  @Column({ name: 'email' })
  email: string;

  @Column({ name: 'avatar_url' })
  avatarUrl: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @OneToMany(
    () => InvestmentEntity,
    (investment) => investment.user,
  )
  investments: InvestmentEntity[];
}
