import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';
import { Cart, CartSchema } from './entities/cart.entity';
import { Product, ProductSchema } from '../product/entities/product.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Cart.name, schema: CartSchema },
      { name: Product.name, schema: ProductSchema },
    ]),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'mySuperSecretKey123',
      signOptions: { expiresIn: '7d' },
    }),
  ],
  controllers: [CartController],
  providers: [CartService],
  exports: [CartService],
})
export class CartModule {}