import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  JoinColumn,
  OneToOne,
  OneToMany,
} from 'typeorm';
import { User } from '../user/user.entity';
import { WalletShares } from '../wallet-shares/wallet-shares.entity';
import { Trade } from '../trade/trade.entity';

@Entity()
export class Wallet {
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
    type: 'timestamp',
    nullable: false,
    default: (): string => 'CURRENT_TIMESTAMP',
    name: 'created_at',
  })
  createdAt: string | null;

  @OneToOne(() => User, (user: User) => user.wallet, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'user_id', referencedColumnName: 'id' }])
  userId: number;

  @OneToMany(
    () => WalletShares,
    (walletShares: WalletShares) => walletShares.wallet,
    {
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
  )
  @JoinColumn([{ name: 'wallet_id', referencedColumnName: 'id' }])
  walletShares: WalletShares[];

  @OneToMany(() => Trade, (trade: Trade) => trade.wallet, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'wallet_id', referencedColumnName: 'id' }])
  trade: Trade;
}
