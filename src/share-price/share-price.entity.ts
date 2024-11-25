import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { Share } from '../share/share.entity';

@Entity()
export class SharePrice {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'decimal',
    name: 'price',
    precision: 10,
    scale: 2,
    nullable: false,
  })
  price: number;

  @Column({
    type: 'timestamp',
    nullable: false,
    default: (): string => 'CURRENT_TIMESTAMP',
    name: 'priceTime',
  })
  priceTime: string | null;

  @Column({
    type: 'timestamp',
    nullable: false,
    default: (): string => 'CURRENT_TIMESTAMP',
    name: 'created_at',
  })
  createdAt: string | null;

  @ManyToOne(() => Share, (share) => share.sharePrice, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'share_id', referencedColumnName: 'id' }])
  share: Share;
}
