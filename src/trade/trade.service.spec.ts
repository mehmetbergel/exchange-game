import { Test, TestingModule } from '@nestjs/testing';
import { TradeService } from './trade.service';
import { ShareService } from '~/share/share.service';
import { WalletShareService } from '~/wallet-shares/wallet-share.service';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Trade } from './trade.entity';
import { CreateTradeDto, ETradeType } from './trade.dto';
import { WalletShares } from '~/wallet-shares/wallet-shares.entity';
import { BadRequestException } from '@nestjs/common';

describe('TradeService', () => {
  let service: TradeService;
  let tradesRepository: Repository<Trade>;
  let shareService: ShareService;
  let walletShareService: WalletShareService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TradeService,
        {
          provide: getRepositoryToken(Trade),
          useClass: Repository,
        },
        {
          provide: ShareService,
          useValue: {
            findShareWithLatestPrice: jest.fn(),
          },
        },
        {
          provide: WalletShareService,
          useValue: {
            findWalletShare: jest.fn(),
            updateWalletShare: jest.fn(),
            createWalletShare: jest.fn(),
            deleteWalletShare: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<TradeService>(TradeService);
    tradesRepository = module.get<Repository<Trade>>(getRepositoryToken(Trade));
    shareService = module.get<ShareService>(ShareService);
    walletShareService = module.get<WalletShareService>(WalletShareService);
  });

  describe('buyShare', () => {
    it('should successfully execute a buy trade', async () => {
      const createTradeDto: CreateTradeDto = {
        walletId: 1,
        shareId: 1,
        quantity: 10,
      };

      const shareWithLatestPrice = {
        sharePrice: [{ price: 100 }],
      };
      const createdTrade = {
        id: 1,
        wallet: { id: 1 },
        share: { id: 1 },
        tradeType: ETradeType.BUY,
        price: 100,
        quantity: 10,
      };

      jest
        .spyOn(shareService, 'findShareWithLatestPrice')
        .mockResolvedValue(shareWithLatestPrice as any);
      jest.spyOn(walletShareService, 'findWalletShare').mockResolvedValue(null);
      jest
        .spyOn(tradesRepository, 'create')
        .mockReturnValue(createdTrade as any);
      jest
        .spyOn(tradesRepository, 'save')
        .mockResolvedValue(createdTrade as Trade);
      jest
        .spyOn(walletShareService, 'createWalletShare')
        .mockResolvedValue({} as WalletShares);

      const result = await service.buyShare(createTradeDto);

      expect(result).toEqual({
        message: 'Trade completed successfully',
        trade: createdTrade,
      });
      expect(shareService.findShareWithLatestPrice).toHaveBeenCalledWith(1);
      expect(walletShareService.createWalletShare).toHaveBeenCalledWith(
        1,
        1,
        10,
      );
      expect(tradesRepository.save).toHaveBeenCalledWith(createdTrade);
    });

    it('should throw an error if the share is not found', async () => {
      jest
        .spyOn(shareService, 'findShareWithLatestPrice')
        .mockRejectedValue(new BadRequestException('Share not found.'));

      await expect(
        service.buyShare({ walletId: 1, shareId: 1, quantity: 10 }),
      ).rejects.toThrow(BadRequestException);

      expect(walletShareService.createWalletShare).not.toHaveBeenCalled();
    });
  });

  describe('sellShare', () => {
    it('should successfully execute a sell trade', async () => {
      const createTradeDto: CreateTradeDto = {
        walletId: 1,
        shareId: 1,
        quantity: 5,
      };

      const shareWithLatestPrice = {
        sharePrice: [{ price: 100 }],
      };
      const walletShare = {
        totalQuantity: 10,
      };
      const createdTrade = {
        id: 1,
        wallet: { id: 1 },
        share: { id: 1 },
        tradeType: ETradeType.SELL,
        price: 100,
        quantity: 5,
      };

      jest
        .spyOn(shareService, 'findShareWithLatestPrice')
        .mockResolvedValue(shareWithLatestPrice as any);
      jest
        .spyOn(walletShareService, 'findWalletShare')
        .mockResolvedValue(walletShare as any);
      jest
        .spyOn(tradesRepository, 'create')
        .mockReturnValue(createdTrade as any);
      jest
        .spyOn(tradesRepository, 'save')
        .mockResolvedValue(createdTrade as Trade);
      jest
        .spyOn(walletShareService, 'updateWalletShare')
        .mockResolvedValue(undefined);

      const result = await service.sellShare(createTradeDto);

      expect(result).toEqual({
        message: 'Share sold successfully',
        trade: createdTrade,
      });
      expect(walletShareService.updateWalletShare).toHaveBeenCalledWith(
        walletShare,
        -5,
      );
    });

    it('should throw an error if the share price is not found', async () => {
      jest
        .spyOn(shareService, 'findShareWithLatestPrice')
        .mockRejectedValue(
          new BadRequestException('No price data available for the share.'),
        );

      await expect(
        service.sellShare({ walletId: 1, shareId: 1, quantity: 10 }),
      ).rejects.toThrow(BadRequestException);

      expect(walletShareService.updateWalletShare).not.toHaveBeenCalled();
    });

    it('should throw an error if wallet does not have enough quantity', async () => {
      const walletShare = {
        totalQuantity: 5,
      };

      jest
        .spyOn(shareService, 'findShareWithLatestPrice')
        .mockResolvedValue({ sharePrice: [{ price: 100 }] } as any);
      jest
        .spyOn(walletShareService, 'findWalletShare')
        .mockResolvedValue(walletShare as any);

      await expect(
        service.sellShare({ walletId: 1, shareId: 1, quantity: 10 }),
      ).rejects.toThrow(BadRequestException);

      expect(walletShareService.updateWalletShare).not.toHaveBeenCalled();
    });
  });
});
