import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete, UseGuards,
} from '@nestjs/common';
import { ShareService } from './share.service';
import { Share } from './share.entity';
import {ApiBearerAuth, ApiBody} from '@nestjs/swagger';
import { CreateOneShareDto } from './share.dto';
import {JwtAuthGuard} from "~/auth/jwt-auth.guard";

@Controller('share')
@ApiBearerAuth()
export class ShareController {
  constructor(private readonly shareService: ShareService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  findAll(): Promise<Share[]> {
    return this.shareService.findAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id') id: number): Promise<Share | null> {
    return this.shareService.findOne(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBody({ type: CreateOneShareDto })
  create(@Body() share: Partial<Share>): Promise<Share> {
    return this.shareService.create(share);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  update(
    @Param('id') id: number,
    @Body() share: Partial<Share>,
  ): Promise<void> {
    return this.shareService.update(id, share);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: number): Promise<void> {
    return this.shareService.remove(id);
  }
}
