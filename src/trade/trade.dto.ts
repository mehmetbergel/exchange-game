import { IsInt, IsPositive } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum ETradeType {
  BUY = 'BUY',
  SELL = 'SELL',
}

export class CreateTradeDto {
  @ApiProperty()
  @IsInt()
  walletId: number;

  @ApiProperty()
  @IsInt()
  shareId: number;

  @ApiProperty()
  @IsPositive()
  quantity: number;
}
