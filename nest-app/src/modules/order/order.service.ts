import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Order, OrderDocument, OrderStatus } from './entities/order.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { Cart, CartDocument } from '../cart/entities/cart.entity';
import { Product, ProductDocument } from '../product/entities/product.entity';

@Injectable()
export class OrderService {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
    @InjectModel(Cart.name) private cartModel: Model<CartDocument>,
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
  ) {}

  async create(userId: string, dto: CreateOrderDto) {
    const cart = await this.cartModel.findOne({ userId }).populate('items.productId');
    if (!cart || cart.items.length === 0) {
      throw new BadRequestException('Cart is empty');
    }

    const orderProducts = [];
    let totalPrice = 0;

    for (const item of cart.items) {
      const product = await this.productModel.findById(item.productId);
      if (!product) continue;

      const unitPrice = product.finalPrice;
      const itemTotal = unitPrice * item.quantity;
      totalPrice += itemTotal;

      orderProducts.push({
        productId: product._id,
        quantity: item.quantity,
        unitPrice,
        totalPrice: itemTotal,
      });
    }

    const order = await this.orderModel.create({
      userId,
      products: orderProducts,
      address: dto.address,
      phone: dto.phone,
      currency: dto.currency || 'EGP',
      totalPrice,
      discountPercent: 0,
      finalPrice: totalPrice,
      orderStatus: OrderStatus.PENDING,
    });

    await this.cartModel.findOneAndDelete({ userId });

    return order;
  }

  async findAll(userId: string) {
    return this.orderModel
      .find({ userId })
      .populate('products.productId')
      .sort({ createdAt: -1 });
  }

  async findOne(id: string) {
    const order = await this.orderModel
      .findById(id)
      .populate('products.productId');
    if (!order) throw new NotFoundException('Order not found');
    return order;
  }

  async confirmOrder(orderId: string) {
    const order = await this.orderModel.findById(orderId);
    if (!order) throw new NotFoundException('Order not found');

    order.orderStatus = OrderStatus.DELIVERED;
    await order.save();
    return order;
  }

  async cancelOrder(orderId: string) {
    const order = await this.orderModel.findById(orderId);
    if (!order) throw new NotFoundException('Order not found');

    order.orderStatus = OrderStatus.CANCELLED;
    await order.save();
    return order;
  }
}