import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Wallet } from '../wallet/wallet.entity';
import { Share } from '../share/share.entity';
import { ETradeType } from '../trade/trade.dto';

@Entity()
export class Trade {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'enum',
    enum: ETradeType,
    name: 'trade_type',
    nullable: false,
  })
  tradeType: ETradeType;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: false,
    name: 'price',
  })
  price: number;

  @Column({ type: 'int', nullable: false, name: 'quantity' })
  quantity: number;

  @Column({
    type: 'timestamp',
    nullable: false,
    default: (): string => 'CURRENT_TIMESTAMP',
    name: 'created_at',
  })
  createdAt: string;

  @Column({
    type: 'timestamp',
    nullable: false,
    default: (): string => 'CURRENT_TIMESTAMP',
    name: 'updated_at',
  })
  updatedAt: string;

  @ManyToOne(() => Wallet, (wallet) => wallet.trade, {
    nullable: false,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'wallet_id', referencedColumnName: 'id' })
  wallet: Wallet;

  @ManyToOne(() => Share, (share) => share.trade, {
    nullable: false,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'share_id', referencedColumnName: 'id' })
  share: Share;
}
