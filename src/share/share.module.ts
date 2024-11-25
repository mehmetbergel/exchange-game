import { Module } from '@nestjs/common';
import { ShareService } from './share.service';
import { ShareController } from './share.controller';
import { Share } from './share.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SharePriceModule } from '../share-price/share-price.module';

@Module({
  imports: [TypeOrmModule.forFeature([Share]), SharePriceModule],
  providers: [ShareService],
  exports: [ShareService],
  controllers: [ShareController],
})
export class ShareModule {}
