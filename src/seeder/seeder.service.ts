import { Injectable} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from "~/user/user.entity";
import { Wallet } from "~/wallet/wallet.entity";
import { Share } from "~/share/share.entity";
import { SharePrice } from "~/share-price/share-price.entity";
import { WalletShares } from "~/wallet-shares/wallet-shares.entity";

@Injectable()
export class SeederService {
    @InjectRepository(User) private userRepository: Repository<User>;

    constructor(
        @InjectRepository(User) userRepository: Repository<User>,
        @InjectRepository(Wallet) private walletRepository: Repository<Wallet>,
        @InjectRepository(Share) private shareRepository: Repository<Share>,
        @InjectRepository(SharePrice) private sharePriceRepository: Repository<SharePrice>,
        @InjectRepository(WalletShares) private walletSharesRepository: Repository<WalletShares>,
    ) {
        this.userRepository = userRepository;
    }

    public async seed() {
        const userCount = await this.userRepository.count();
        if (userCount > 0) {
            return;
        }
        const users = [];
        for (let i = 1; i <= 5; i++) {
            const user = this.userRepository.create({
                name: `User_${i}`,
                email: `user${i}@eva.com`,
                password: '123',
            });
            const savedUser = await this.userRepository.save(user);
            users.push(savedUser.id);
        }

        const wallets = [];
        for (const userId of users) {
            const wallet = this.walletRepository.create({
                userId: userId,
                name: `Wallet for User ${userId}`,
            });
            const savedWallet = await this.walletRepository.save(wallet);
            wallets.push(savedWallet.id);
        }

        const shares = [];
        for (let i = 1; i <= 5; i++) {
            const share = this.shareRepository.create({
                name: `Share${i}`,
                symbol: `S${i}`,
            });
            const savedShare = await this.shareRepository.save(share);
            shares.push(savedShare.id);
        }

        for (const shareId of shares) {
            const share: Share | null = await this.shareRepository.findOne({
                where: {id: shareId},
            });

            if (share) {
                const sharePrice: SharePrice = this.sharePriceRepository.create({
                    shareId: share.id,
                    price: Math.random() * 100
                });

                await this.sharePriceRepository.save(sharePrice);
            } else {
                console.error(`Share with ID ${shareId} not found.`);
            }
        }

        for (const walletId of wallets) {
            for (const shareId of shares) {
                const randomQuantity = Math.floor(Math.random() * 50) + 1;
                const walletShare = this.walletSharesRepository.create({
                    walletId: walletId,
                    shareId: shareId,
                    totalQuantity: randomQuantity,
                });
                await this.walletSharesRepository.save(walletShare);
            }
        }
    }
}
