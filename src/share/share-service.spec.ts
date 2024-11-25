import { Test, TestingModule } from '@nestjs/testing';
import { ShareService } from './share.service';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { Share } from './share.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { SharePriceService } from '../share-price/share-price.service';
import { BadRequestException } from '@nestjs/common';
import { SharePrice } from '../share-price/share-price.entity';

describe('ShareService', () => {
  let service: ShareService;
  let shareRepository: Repository<Share>;
  let sharePriceService: SharePriceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ShareService,
        {
          provide: getRepositoryToken(Share),
          useClass: Repository,
        },
        {
          provide: SharePriceService,
          useValue: {
            addSharePrice: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<ShareService>(ShareService);
    shareRepository = module.get<Repository<Share>>(getRepositoryToken(Share));
    sharePriceService = module.get<SharePriceService>(SharePriceService);
  });

  describe('findAll', () => {
    it('should return an array of shares', async () => {
      const shares: Share[] = [
        { id: 1, name: 'Share1', symbol: 'S1' } as Share,
      ];
      jest.spyOn(shareRepository, 'find').mockResolvedValue(shares);

      const result = await service.findAll();
      expect(result).toEqual(shares);
      expect(shareRepository.find).toHaveBeenCalledTimes(1);
    });
  });

  describe('findOne', () => {
    it('should return a single share by ID', async () => {
      const share = { id: 1, name: 'Share1', symbol: 'S1' } as Share;
      jest.spyOn(shareRepository, 'findOneBy').mockResolvedValue(share);

      const result = await service.findOne(1);
      expect(result).toEqual(share);
      expect(shareRepository.findOneBy).toHaveBeenCalledWith({ id: 1 });
    });

    it('should return null if no share is found', async () => {
      jest.spyOn(shareRepository, 'findOneBy').mockResolvedValue(null);

      const result = await service.findOne(999);
      expect(result).toBeNull();
    });
  });

  describe('create', () => {
    it('should create and return a new share', async () => {
      const newShare = { name: 'NewShare', symbol: 'NS' } as Share;
      const createdShare = { ...newShare, id: 1 } as Share;
      jest.spyOn(shareRepository, 'save').mockResolvedValue(createdShare);

      const result = await service.create(newShare);
      expect(result).toEqual(createdShare);
      expect(shareRepository.save).toHaveBeenCalledWith(newShare);
    });
  });

  describe('update', () => {
    it('should update a share by ID', async () => {
      jest
        .spyOn(shareRepository, 'update')
        .mockResolvedValue({} as UpdateResult);

      await service.update(1, { name: 'UpdatedShare' });
      expect(shareRepository.update).toHaveBeenCalledWith(1, {
        name: 'UpdatedShare',
      });
    });
  });

  describe('remove', () => {
    it('should delete a share by ID', async () => {
      jest
        .spyOn(shareRepository, 'delete')
        .mockResolvedValue({} as DeleteResult);

      await service.remove(1);
      expect(shareRepository.delete).toHaveBeenCalledWith(1);
    });
  });

  describe('findShareWithLatestPrice', () => {
    it('should return a share with its latest price', async () => {
      const shareWithPrice = {
        id: 1,
        name: 'Share1',
        symbol: 'S1',
        sharePrice: [{ price: 100 }],
      } as Share;
      jest
        .spyOn(shareRepository, 'createQueryBuilder')
        .mockImplementation(() => {
          return {
            leftJoinAndSelect: jest.fn().mockReturnThis(),
            where: jest.fn().mockReturnThis(),
            getOne: jest.fn().mockResolvedValue(shareWithPrice),
          } as any;
        });

      const result = await service.findShareWithLatestPrice(1);
      expect(result).toEqual(shareWithPrice);
    });

    it('should throw BadRequestException if share is not found', async () => {
      jest
        .spyOn(shareRepository, 'createQueryBuilder')
        .mockImplementation(() => {
          return {
            leftJoinAndSelect: jest.fn().mockReturnThis(),
            where: jest.fn().mockReturnThis(),
            getOne: jest.fn().mockResolvedValue(null),
          } as any;
        });

      await expect(service.findShareWithLatestPrice(999)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('randomCalculateNewPrice', () => {
    it('should return a calculated new price', () => {
      const currentPrice = 100;
      const result = service['randomCalculateNewPrice'](currentPrice);

      expect(typeof result).toBe('number');
      expect(result).not.toEqual(currentPrice); // Yeni fiyat farklı olmalı
    });
  });

  describe('updateSharePrices', () => {
    it('should update share prices for all shares', async () => {
      const shares: Share[] = [
        {
          id: 1,
          name: 'Share1',
          symbol: 'S1',
          sharePrice: [{ price: 100 }],
        } as Share,
      ];
      jest
        .spyOn(shareRepository, 'createQueryBuilder')
        .mockImplementation(() => {
          return {
            leftJoinAndSelect: jest.fn().mockReturnThis(),
            getMany: jest.fn().mockResolvedValue(shares),
          } as any;
        });

      jest.spyOn(service, 'randomCalculateNewPrice').mockReturnValue(110);
      jest
        .spyOn(sharePriceService, 'addSharePrice')
        .mockResolvedValue({} as SharePrice);

      await service.updateSharePrices();

      expect(sharePriceService.addSharePrice).toHaveBeenCalledWith(1, 110);
    });
  });
});
