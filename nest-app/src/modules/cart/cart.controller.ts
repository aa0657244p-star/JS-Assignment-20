import {
  Controller,
  Post,
  Body,
  Get,
  Delete,
  Param,
  UseGuards,
  Req,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { AuthGuard } from '../auth/guards/auth.guard';

@Controller('cart')
@UseGuards(AuthGuard)
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post('add')
  async addToCart(@Body() dto: AddToCartDto, @Req() req: any) {
    return this.cartService.addToCart(req.user.id, dto);
  }

  @Get()
  async getCart(@Req() req: any) {
    return this.cartService.getCart(req.user.id);
  }

  @Delete('remove/:productId')
  async removeItem(@Param('productId') productId: string, @Req() req: any) {
    return this.cartService.removeItem(req.user.id, productId);
  }

  @Delete('clear')
  async clearCart(@Req() req: any) {
    return this.cartService.clearCart(req.user.id);
  }
}