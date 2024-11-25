import { BadRequestException, Body, Controller, Post } from '@nestjs/common';
import { TradeService } from '../trade/trade.service';
import { CreateTradeDto } from '../trade/trade.dto';
import { ApiBody } from '@nestjs/swagger';

@Controller('trade')
export class TradeController {
  constructor(private readonly tradeService: TradeService) {}

  @Post('buy')
  @ApiBody({ type: CreateTradeDto })
  async buy(@Body() createTradeDto: CreateTradeDto) {
    const { walletId, shareId, quantity } = createTradeDto;

    if (!walletId || !shareId || !quantity || quantity <= 0) {
      throw new BadRequestException('Invalid trade details.');
    }

    return await this.tradeService.buyShare(createTradeDto);
  }

  @Post('sell')
  public async sellShare(@Body() createTradeDto: CreateTradeDto) {
    return this.tradeService.sellShare(createTradeDto);
  }
}
