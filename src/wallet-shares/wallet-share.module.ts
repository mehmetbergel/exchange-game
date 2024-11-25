import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WalletShareService } from './wallet-share.service';
import { WalletShares } from './wallet-shares.entity';

@Module({
  imports: [TypeOrmModule.forFeature([WalletShares])],
  providers: [WalletShareService],
  exports: [WalletShareService],
})
export class WalletShareModule {}
