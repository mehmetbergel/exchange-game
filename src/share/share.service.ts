import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Share } from './share.entity';
import { Cron, CronExpression } from '@nestjs/schedule';
import { SharePriceService } from '../share-price/share-price.service';

@Injectable()
export class ShareService {
  constructor(
    @InjectRepository(Share)
    private readonly shareRepository: Repository<Share>,
    private readonly sharePriceService: SharePriceService,
  ) {}

  public async findAll(): Promise<Share[]> {
    return await this.shareRepository.find();
  }

  public async findOne(id: number): Promise<Share | null> {
    return await this.shareRepository.findOneBy({ id });
  }

  public async create(share: Partial<Share>): Promise<Share> {
    return await this.shareRepository.save(share);
  }

  public async update(id: number, share: Partial<Share>): Promise<void> {
    return await this.shareRepository.update(id, share).then(() => {});
  }

  public async remove(id: number): Promise<void> {
    return await this.shareRepository.delete(id).then(() => {});
  }

  public async findShareWithLatestPrice(shareId: number): Promise<Share> {
    const shareWithLatestPrice = await this.shareRepository
      .createQueryBuilder('share')
      .leftJoinAndSelect(
        'share.sharePrice',
        'sharePrice',
        'sharePrice.priceTime = (SELECT MAX(priceTime) FROM share_price WHERE share_id = share.id)',
      )
      .where('share.id = :shareId', { shareId })
      .getOne();

    if (!shareWithLatestPrice) {
      throw new BadRequestException('Share not found.');
    }

    return shareWithLatestPrice;
  }

  @Cron(CronExpression.EVERY_HOUR)
  async updateSharePrices() {
    const shares: Share[] = await this.shareRepository
      .createQueryBuilder('share')
      .leftJoinAndSelect(
        'share.sharePrice',
        'sharePrice',
        'sharePrice.priceTime = (SELECT MAX(priceTime) FROM share_price WHERE share_id = share.id)',
      )
      .getMany();

    for (const share of shares) {
      const newPrice: number = this.randomCalculateNewPrice(
        parseFloat(Number(share.sharePrice[0].price).toFixed(2)),
      );

      await this.sharePriceService.addSharePrice(share.id, newPrice);
    }

    console.log('Share prices updated successfully.');
  }

  public randomCalculateNewPrice(currentPrice: number): number {
    const randomNumber = parseFloat(Math.random().toFixed(2));
    const operations = [
      (oldValue: number) => oldValue + oldValue * randomNumber,
      (oldValue: number) => oldValue - oldValue * randomNumber,
    ];

    const randomIndex = Math.floor(Math.random() * operations.length);
    return operations[randomIndex](currentPrice);
  }
}
