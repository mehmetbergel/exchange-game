import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { SharePrice } from '../share-price/share-price.entity';
import { WalletShares } from '../wallet-shares/wallet-shares.entity';
import { Trade } from '../trade/trade.entity';

@Entity()
export class Share {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
    name: 'name',
    nullable: false,
    length: 250,
  })
  name: string;

  @Column({
    type: 'varchar',
    name: 'symbol',
    nullable: false,
    length: 3,
  })
  symbol: string;

  @Column({
    type: 'timestamp',
    nullable: false,
    default: (): string => 'CURRENT_TIMESTAMP',
    name: 'created_at',
  })
  createdAt: string | null;

  @OneToMany(() => SharePrice, (sharePrice) => sharePrice.share, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    eager: true,
  })
  sharePrice: SharePrice[];

  @OneToMany(() => WalletShares, (walletShares) => walletShares.wallet, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'wallet_id', referencedColumnName: 'id' }])
  walletShares: WalletShares[];

  @OneToMany(() => Trade, (trade: Trade) => trade.wallet, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'share_id', referencedColumnName: 'id' }])
  trade: Trade;
}
