import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Cart, CartDocument } from './entities/cart.entity';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { Product, ProductDocument } from '../product/entities/product.entity';

@Injectable()
export class CartService {
  constructor(
    @InjectModel(Cart.name) private cartModel: Model<CartDocument>,
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
  ) {}

  async addToCart(userId: string, dto: AddToCartDto) {
    const product = await this.productModel.findById(dto.productId);
    if (!product) throw new NotFoundException('Product not found');

    if (product.stock < dto.quantity) {
      throw new BadRequestException(
        `Insufficient stock. Only ${product.stock} available.`,
      );
    }

    let cart = await this.cartModel.findOne({ userId });

    if (!cart) {
      cart = await this.cartModel.create({
        userId,
        items: [
          {
            productId: new Types.ObjectId(dto.productId),
            quantity: dto.quantity,
          },
        ],
        totalPrice: product.finalPrice * dto.quantity,
      });
    } else {
      const itemIndex = cart.items.findIndex(
        (item) => item.productId.toString() === dto.productId,
      );

      if (itemIndex > -1) {
        cart.items[itemIndex].quantity += dto.quantity;
      } else {
        cart.items.push({
          productId: new Types.ObjectId(dto.productId),
          quantity: dto.quantity,
        });
      }

      cart.totalPrice = await this.calculateTotal(cart);
      await cart.save();
    }

    return cart;
  }

  async getCart(userId: string) {
    const cart = await this.cartModel
      .findOne({ userId })
      .populate('items.productId');
    if (!cart) return { userId, items: [], totalPrice: 0 };
    return cart;
  }

  async removeItem(userId: string, productId: string) {
    const cart = await this.cartModel.findOne({ userId });
    if (!cart) throw new NotFoundException('Cart not found');

    cart.items = cart.items.filter(
      (item) => item.productId.toString() !== productId,
    );
    cart.totalPrice = await this.calculateTotal(cart);
    await cart.save();
    return cart;
  }

  async clearCart(userId: string) {
    await this.cartModel.findOneAndDelete({ userId });
    return { message: 'Cart cleared' };
  }

  private async calculateTotal(cart: CartDocument): Promise<number> {
    let total = 0;
    for (const item of cart.items) {
      const product = await this.productModel.findById(item.productId);
      if (product) total += product.finalPrice * item.quantity;
    }
    return total;
  }
}