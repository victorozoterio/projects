import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  UpdateDateColumn,
  ValueTransformer,
} from 'typeorm';
import { UserEntity } from '../../users/entities/user.entity';

class CentsTransformer implements ValueTransformer {
  to(value: number | null): number | null {
    return value == null ? null : Math.round(value * 100);
  }
  from(value: number | null): number | null {
    return value == null ? null : value / 100;
  }
}

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

  @Column({ name: 'desired_purchase_value', type: 'integer', transformer: new CentsTransformer() })
  desiredPurchaseValue: number;

  @Column({ name: 'desired_sales_price', type: 'integer', transformer: new CentsTransformer() })
  desiredSalesPrice: number;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @Column({ name: 'last_email_sent_at', nullable: true })
  lastEmailSentAt: Date;

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
