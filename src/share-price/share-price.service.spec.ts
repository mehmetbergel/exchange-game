import { Test, TestingModule } from '@nestjs/testing';
import { SharePriceService } from './share-price.service';
import { SharePrice } from './share-price.entity';
import { Repository } from 'typeorm';
import { Share } from '~/share/share.entity';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('SharePriceService', () => {
  let service: SharePriceService;
  let sharePriceRepository: Repository<SharePrice>;
  let shareRepository: Repository<Share>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SharePriceService,
        {
          provide: getRepositoryToken(SharePrice),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(Share),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<SharePriceService>(SharePriceService);
    sharePriceRepository = module.get<Repository<SharePrice>>(
      getRepositoryToken(SharePrice),
    );
    shareRepository = module.get<Repository<Share>>(getRepositoryToken(Share));
  });

  describe('addSharePrice', () => {
    it('should add a new share price for an existing share', async () => {
      const share = { id: 1, name: 'Test Share', symbol: 'TS' } as Share;
      jest.spyOn(shareRepository, 'findOne').mockResolvedValue(share);

      const createdSharePrice = {
        id: 1,
        price: 100,
        share,
      } as SharePrice;
      jest
        .spyOn(sharePriceRepository, 'create')
        .mockReturnValue(createdSharePrice);
      jest
        .spyOn(sharePriceRepository, 'save')
        .mockResolvedValue(createdSharePrice);

      const result = await service.addSharePrice(1, 100);

      expect(result).toEqual(createdSharePrice);
      expect(shareRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(sharePriceRepository.create).toHaveBeenCalledWith({
        share,
        price: 100,
      });
      expect(sharePriceRepository.save).toHaveBeenCalledWith(createdSharePrice);
    });

    it('should throw an error if the share does not exist', async () => {
      jest.spyOn(shareRepository, 'findOne').mockResolvedValue(null);

      await expect(service.addSharePrice(999, 100)).rejects.toThrow(
        'Share with id 999 not found.',
      );

      expect(shareRepository.findOne).toHaveBeenCalledWith({
        where: { id: 999 },
      });
      expect(sharePriceRepository.create).not.toHaveBeenCalled();
      expect(sharePriceRepository.save).not.toHaveBeenCalled();
    });
  });
});
