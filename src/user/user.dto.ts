import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, Length } from 'class-validator';

export class UserCreateOneDto {
  @ApiProperty()
  @Length(1, 250)
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @Length(1, 250)
  @IsNotEmpty()
  email: string;

  @ApiProperty()
  @Length(1, 50)
  @IsNotEmpty()
  password: string;
}
