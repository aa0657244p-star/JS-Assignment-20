import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type OrderDocument = Order & Document;

export enum OrderStatus {
  PENDING = 'pending',
  ON_THE_WAY = 'on_the_way',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled',
  REFUNDED = 'refunded',
}

@Schema({ _id: false })
export class OrderProduct {
  @Prop({ type: Types.ObjectId, ref: 'Product', required: true })
  productId: Types.ObjectId;

  @Prop({ type: Number, required: true })
  quantity: number;

  @Prop({ type: Number, required: true })
  unitPrice: number;

  @Prop({ type: Number, required: true })
  totalPrice: number;
}

export const OrderProductSchema = SchemaFactory.createForClass(OrderProduct);

@Schema({ timestamps: true })
export class Order {
  _id?: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ type: [OrderProductSchema], default: [] })
  products: OrderProduct[];

  @Prop({ type: String, default: '' })
  address: string;

  @Prop({ type: String, default: '' })
  phone: string;

  @Prop({ type: String, default: 'EGP' })
  currency: string;

  @Prop({ type: Number, required: true })
  totalPrice: number;

  @Prop({ type: Number, default: 0 })
  discountPercent: number;

  @Prop({ type: Number, required: true })
  finalPrice: number;

  @Prop({ type: String, enum: Object.values(OrderStatus), default: OrderStatus.PENDING })
  orderStatus: OrderStatus;

  @Prop({ type: String })
  paymentIntentId: string;

  @Prop({ type: Date })
  paidAt: Date;

  @Prop({ type: Types.ObjectId, ref: 'Coupon' })
  couponId: Types.ObjectId;
}

export const OrderSchema = SchemaFactory.createForClass(Order);