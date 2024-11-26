import { Test, TestingModule } from '@nestjs/testing';
import { WalletShareService } from './wallet-share.service';
import { WalletShares } from './wallet-shares.entity';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('WalletShareService', () => {
  let service: WalletShareService;
  let walletSharesRepository: Repository<WalletShares>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WalletShareService,
        {
          provide: getRepositoryToken(WalletShares),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<WalletShareService>(WalletShareService);
    walletSharesRepository = module.get<Repository<WalletShares>>(
      getRepositoryToken(WalletShares),
    );
  });

  describe('findWalletShare', () => {
    it('should return a wallet share if found', async () => {
      const walletShare: WalletShares = {
        id: 1,
        wallet: { id: 1 } as any,
        walletId: 1,
        share: { id: 1 } as any,
        shareId: 1,
        totalQuantity: 10,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      jest
        .spyOn(walletSharesRepository, 'findOne')
        .mockResolvedValue(walletShare);

      const result = await service.findWalletShare(1, 1);
      expect(result).toEqual(walletShare);
      expect(walletSharesRepository.findOne).toHaveBeenCalledWith({
        where: { wallet: { id: 1 }, share: { id: 1 } },
        relations: ['wallet', 'share'],
      });
    });

    it('should return null if wallet share is not found', async () => {
      jest.spyOn(walletSharesRepository, 'findOne').mockResolvedValue(null);

      const result = await service.findWalletShare(1, 999);
      expect(result).toBeNull();
    });
  });

  describe('updateWalletShare', () => {
    it('should update the wallet share quantity and updatedAt', async () => {
      const walletShare: WalletShares = {
        id: 1,
        wallet: { id: 1 } as any,
        walletId: 1,
        share: { id: 1 } as any,
        shareId: 1,
        totalQuantity: 10,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      jest.spyOn(walletSharesRepository, 'save').mockResolvedValue(walletShare);

      await service.updateWalletShare(walletShare, 5);

      expect(walletShare.totalQuantity).toBe(15);
      expect(new Date(walletShare.updatedAt).getTime()).toBeGreaterThan(
        new Date(walletShare.createdAt).getTime(),
      );
      expect(walletSharesRepository.save).toHaveBeenCalledWith(walletShare);
    });
  });

  describe('createWalletShare', () => {
    it('should create and return a new wallet share', async () => {
      const newWalletShare: WalletShares = {
        id: 1,
        wallet: { id: 1 } as any,
        walletId: 1,
        share: { id: 1 } as any,
        shareId: 1,
        totalQuantity: 10,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      jest
        .spyOn(walletSharesRepository, 'create')
        .mockReturnValue(newWalletShare);
      jest
        .spyOn(walletSharesRepository, 'save')
        .mockResolvedValue(newWalletShare);

      const result = await service.createWalletShare(1, 1, 10);

      expect(result).toEqual(newWalletShare);
      expect(walletSharesRepository.create).toHaveBeenCalledWith({
        wallet: { id: 1 },
        share: { id: 1 },
        totalQuantity: 10,
      });
      expect(walletSharesRepository.save).toHaveBeenCalledWith(newWalletShare);
    });
  });

  describe('deleteWalletShare', () => {
    it('should delete the wallet share', async () => {
      const walletShare: WalletShares = {
        id: 1,
        wallet: { id: 1 } as any,
        walletId: 1,
        share: { id: 1 } as any,
        shareId: 1,
        totalQuantity: 10,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      jest
        .spyOn(walletSharesRepository, 'remove')
        .mockResolvedValue(walletShare);

      await service.deleteWalletShare(walletShare);

      expect(walletSharesRepository.remove).toHaveBeenCalledWith(walletShare);
    });
  });
});
