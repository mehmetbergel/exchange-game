import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Wallet } from '../wallet/wallet.entity';
import { Share } from '../share/share.entity';

@Entity()
export class WalletShares {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'decimal',
    name: 'total_quantity',
    precision: 10,
    scale: 2,
    nullable: false,
  })
  totalQuantity: number;

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

  @Column({ name: 'wallet_id' })
  walletId: number;

  @Column({ name: 'share_id' })
  shareId: number;

  @ManyToOne(() => Wallet, (wallet) => wallet.walletShares, {
    nullable: false,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'wallet_id', referencedColumnName: 'id' })
  wallet: Wallet;

  @ManyToOne(() => Share, (share) => share.walletShares, {
    nullable: false,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'share_id', referencedColumnName: 'id' })
  share: Share;
}
