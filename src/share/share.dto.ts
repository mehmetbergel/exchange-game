import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, Length } from 'class-validator';

export class CreateOneShareDto {
  @ApiProperty()
  @Length(1, 250)
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @Length(1, 3)
  @IsNotEmpty()
  symbol: string;
}
