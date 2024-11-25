import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SharePrice } from './share-price.entity';
import { SharePriceService } from './share-price.service';
import { Share } from '../share/share.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SharePrice, Share])],
  providers: [SharePriceService],
  exports: [SharePriceService],
})
export class SharePriceModule {}
