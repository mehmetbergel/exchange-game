import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SharePrice } from './share-price.entity';
import { Share } from '../share/share.entity';

@Injectable()
export class SharePriceService {
  constructor(
    @InjectRepository(SharePrice)
    private readonly sharePriceRepository: Repository<SharePrice>,
    @InjectRepository(Share)
    private readonly shareRepository: Repository<Share>,
  ) {}

  public async addSharePrice(
    shareId: number,
    price: number,
  ): Promise<SharePrice> {
    const share = await this.shareRepository.findOne({
      where: { id: shareId },
    });

    if (!share) {
      throw new Error(`Share with id ${shareId} not found.`);
    }

    const sharePrice = this.sharePriceRepository.create({
      share,
      price,
    });

    return this.sharePriceRepository.save(sharePrice);
  }
}
