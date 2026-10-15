import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Patch,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { BrandService } from './brand.service';
import { CreateBrandDto } from './dto/create-brand.dto';
import { AuthGuard } from '../auth/guards/auth.guard';

@Controller('brand')
export class BrandController {
  constructor(private readonly brandService: BrandService) {}

  @UseGuards(AuthGuard)
  @Post()
  async create(@Body() dto: CreateBrandDto, @Req() req: any) {
    return this.brandService.create(dto, req.user.id);
  }

  @Get()
  async findAll() {
    return this.brandService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.brandService.findOne(id);
  }

  @UseGuards(AuthGuard)
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() dto: CreateBrandDto,
    @Req() req: any,
  ) {
    return this.brandService.update(id, dto, req.user.id);
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.brandService.remove(id);
  }
}