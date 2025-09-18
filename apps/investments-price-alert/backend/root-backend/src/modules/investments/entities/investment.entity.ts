import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryColumn, UpdateDateColumn } from 'typeorm';
import { UserEntity } from '../../users/entities/user.entity';

@Entity('investments')
export class InvestmentEntity {
  @PrimaryColumn('uuid', { name: 'uuid' })
  uuid: string;

  @Column({ name: 'name' })
  name: string;

  @Column({ name: 'code' })
  code: string;

  @Column({ name: 'category' })
  category: string;

  @Column({ name: 'desired_purchase_value', precision: 15, scale: 2 })
  desiredPurchaseValue: number;

  @Column({ name: 'desired_sales_price', precision: 15, scale: 2 })
  desiredSalesPrice: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ManyToOne(
    () => UserEntity,
    (user) => user.investments,
  )
  @JoinColumn({ name: 'user_uuid' })
  user: UserEntity;
}
