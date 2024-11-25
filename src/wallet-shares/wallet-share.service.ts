import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WalletShares } from './wallet-shares.entity';

@Injectable()
export class WalletShareService {
  constructor(
    @InjectRepository(WalletShares)
    private readonly walletSharesRepository: Repository<WalletShares>,
  ) {}

  public async findWalletShare(
    walletId: number,
    shareId: number,
  ): Promise<WalletShares | null> {
    return this.walletSharesRepository.findOne({
      where: { wallet: { id: walletId }, share: { id: shareId } },
      relations: ['wallet', 'share'],
    });
  }

  public async updateWalletShare(
    walletShare: WalletShares,
    quantity: number,
  ): Promise<void> {
    const currentQuantity = parseFloat(
      Number(walletShare.totalQuantity).toFixed(2),
    );
    walletShare.totalQuantity = parseFloat(
      (currentQuantity + quantity).toFixed(2),
    );
    walletShare.updatedAt = new Date().toISOString();
    await this.walletSharesRepository.save(walletShare);
  }

  public async createWalletShare(
    walletId: number,
    shareId: number,
    quantity: number,
  ): Promise<WalletShares> {
    const newWalletShare = this.walletSharesRepository.create({
      wallet: { id: walletId },
      share: { id: shareId },
      totalQuantity: quantity,
    });
    return this.walletSharesRepository.save(newWalletShare);
  }

  public async deleteWalletShare(walletShare: WalletShares): Promise<void> {
    await this.walletSharesRepository.remove(walletShare);
  }
}
