import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Trade } from './trade.entity';
import { ShareService } from '../share/share.service';
import { WalletShareService } from '../wallet-shares/wallet-share.service';
import { CreateTradeDto, ETradeType } from './trade.dto';
import { WalletShares } from '../wallet-shares/wallet-shares.entity';

@Injectable()
export class TradeService {
  constructor(
    @InjectRepository(Trade)
    private readonly tradesRepository: Repository<Trade>,
    private readonly shareService: ShareService,
    private readonly walletShareService: WalletShareService,
  ) {}

  public async buyShare(createTradeDto: CreateTradeDto) {
    const { walletId, shareId, quantity } = createTradeDto;

    const shareWithLatestPrice =
      await this.shareService.findShareWithLatestPrice(shareId);
    const sharePrice = shareWithLatestPrice.sharePrice[0].price;

    const walletShare = await this.walletShareService.findWalletShare(
      walletId,
      shareId,
    );

    const trade = await this.createTrade(
      walletId,
      shareId,
      quantity,
      sharePrice,
      ETradeType.BUY,
    );

    if (walletShare) {
      await this.walletShareService.updateWalletShare(walletShare, quantity);
    } else {
      await this.walletShareService.createWalletShare(
        walletId,
        shareId,
        quantity,
      );
    }

    return { message: 'Trade completed successfully', trade };
  }

  public async sellShare(createTradeDto: CreateTradeDto) {
    const { walletId, shareId, quantity } = createTradeDto;

    const sharePrice = await this.validateShareAndPrice(shareId);

    const walletShare = await this.validateWalletShare(
      walletId,
      shareId,
      quantity,
    );

    const trade = await this.createTrade(
      walletId,
      shareId,
      quantity,
      sharePrice,
      ETradeType.SELL,
    );

    await this.updateOrDeleteWalletShare(walletShare, quantity);

    return { message: 'Share sold successfully', trade };
  }

  private async validateShareAndPrice(shareId: number) {
    const shareWithLatestPrice =
      await this.shareService.findShareWithLatestPrice(shareId);
    const sharePrice = shareWithLatestPrice.sharePrice[0]?.price;

    if (!sharePrice) {
      throw new BadRequestException('No price data available for the share.');
    }

    return sharePrice;
  }

  private async validateWalletShare(
    walletId: number,
    shareId: number,
    quantity: number,
  ) {
    const walletShare = await this.walletShareService.findWalletShare(
      walletId,
      shareId,
    );

    if (!walletShare) {
      throw new BadRequestException('Share not found in the wallet.');
    }

    if (walletShare.totalQuantity < quantity) {
      throw new BadRequestException(
        'Insufficient share quantity in the wallet.',
      );
    }

    return walletShare;
  }

  private async createTrade(
    walletId: number,
    shareId: number,
    quantity: number,
    price: number,
    tradeType: ETradeType,
  ) {
    const trade = this.tradesRepository.create({
      wallet: { id: walletId },
      share: { id: shareId },
      tradeType,
      price,
      quantity,
    });

    return this.tradesRepository.save(trade);
  }

  private async updateOrDeleteWalletShare(
    walletShare: WalletShares,
    quantity: number,
  ) {
    if (walletShare.totalQuantity - quantity <= 0) {
      await this.walletShareService.deleteWalletShare(walletShare);
    } else {
      await this.walletShareService.updateWalletShare(walletShare, -quantity);
    }
  }
}
