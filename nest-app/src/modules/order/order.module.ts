import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { Order, OrderSchema } from './entities/order.entity';
import { Cart, CartSchema } from '../cart/entities/cart.entity';
import { Product, ProductSchema } from '../product/entities/product.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Order.name, schema: OrderSchema },
      { name: Cart.name, schema: CartSchema },
      { name: Product.name, schema: ProductSchema },
    ]),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'mySuperSecretKey123',
      signOptions: { expiresIn: '7d' },
    }),
  ],
  controllers: [OrderController],
  providers: [OrderService],
  exports: [OrderService],
})
export class OrderModule {}