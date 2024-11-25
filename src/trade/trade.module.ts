import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Trade } from './trade.entity';
import { TradeService } from './trade.service';
import { TradeController } from './trade.controller';
import { ShareModule } from '../share/share.module';
import { WalletShareModule } from '../wallet-shares/wallet-share.module';

@Module({
  imports: [TypeOrmModule.forFeature([Trade]), ShareModule, WalletShareModule],
  providers: [TradeService],
  controllers: [TradeController],
})
export class TradeModule {}
