import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user/user.entity';
import { Share } from '~/share/share.entity';
import { UserModule } from './user/user.module';
import { ShareModule } from '~/share/share.module';
import { Wallet } from '~/wallet/wallet.entity';
import { SharePrice } from '~/share-price/share-price.entity';
import { Trade } from '~/trade/trade.entity';
import { WalletShares } from '~/wallet-shares/wallet-shares.entity';
import { TradeModule } from '~/trade/trade.module';
import { WalletShareModule } from '~/wallet-shares/wallet-share.module';
import { ScheduleModule } from '@nestjs/schedule';
import { SharePriceModule } from '~/share-price/share-price.module';
import { AuthModule } from '~/auth/auth.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'rootpassword',
      database: 'test-exchange',
      entities: [User, Share, SharePrice, Trade, Wallet, WalletShares],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([
      User,
      Share,
      SharePrice,
      Trade,
      Wallet,
      WalletShares,
    ]),
    ScheduleModule.forRoot(),
    UserModule,
    ShareModule,
    SharePriceModule,
    WalletShareModule,
    TradeModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
