import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
} from '@nestjs/common';
import { ShareService } from './share.service';
import { Share } from './share.entity';
import { ApiBody } from '@nestjs/swagger';
import { CreateOneShareDto } from './share.dto';

@Controller('share')
export class ShareController {
  constructor(private readonly shareService: ShareService) {}

  @Get()
  findAll(): Promise<Share[]> {
    return this.shareService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number): Promise<Share | null> {
    return this.shareService.findOne(id);
  }

  @Post()
  @ApiBody({ type: CreateOneShareDto })
  create(@Body() share: Partial<Share>): Promise<Share> {
    return this.shareService.create(share);
  }

  @Put(':id')
  update(
    @Param('id') id: number,
    @Body() share: Partial<Share>,
  ): Promise<void> {
    return this.shareService.update(id, share);
  }

  @Delete(':id')
  remove(@Param('id') id: number): Promise<void> {
    return this.shareService.remove(id);
  }
}
