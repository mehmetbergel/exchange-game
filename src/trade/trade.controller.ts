import {BadRequestException, Body, Controller, Post, UseGuards} from '@nestjs/common';
import { TradeService } from '~/trade/trade.service';
import { CreateTradeDto } from '~/trade/trade.dto';
import {ApiBearerAuth, ApiBody} from '@nestjs/swagger';
import {JwtAuthGuard} from "~/auth/jwt-auth.guard";

@Controller('trade')
@ApiBearerAuth()
export class TradeController {
  constructor(private readonly tradeService: TradeService) {}

  @Post('buy')
  @ApiBody({ type: CreateTradeDto })
  @UseGuards(JwtAuthGuard)
  async buy(@Body() createTradeDto: CreateTradeDto) {
    const { walletId, shareId, quantity } = createTradeDto;

    if (!walletId || !shareId || !quantity || quantity <= 0) {
      throw new BadRequestException('Invalid trade details.');
    }

    return await this.tradeService.buyShare(createTradeDto);
  }

  @Post('sell')
  @UseGuards(JwtAuthGuard)
  public async sellShare(@Body() createTradeDto: CreateTradeDto) {
    return this.tradeService.sellShare(createTradeDto);
  }
}
