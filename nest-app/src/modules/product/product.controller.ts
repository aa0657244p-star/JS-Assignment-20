import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Patch,
  Delete,
  Query,
  UseGuards,
  Req,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { AuthGuard } from '../auth/guards/auth.guard';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @UseGuards(AuthGuard)
  @Post()
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads/products',
        filename: (req, file, cb) => {
          const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, `${unique}${extname(file.originalname)}`);
        },
      }),
    }),
  )
  async create(
    @Body() dto: CreateProductDto,
    @UploadedFile() file: Express.Multer.File,
    @Req() req: any,
  ) {
    const imageUrl = file ? `/uploads/products/${file.filename}` : '';
    return this.productService.create({ ...dto, image: imageUrl }, req.user.id);
  }

  @Get()
  async findAll() {
    return this.productService.findAll();
  }

  @Get('paginate')
  async paginate(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
  ) {
    return this.productService.getProductsPaginated(
      parseInt(page),
      parseInt(limit),
    );
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.productService.findOne(id);
  }

  @UseGuards(AuthGuard)
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() dto: CreateProductDto,
    @Req() req: any,
  ) {
    return this.productService.update(id, dto, req.user.id);
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.productService.remove(id);
  }
}