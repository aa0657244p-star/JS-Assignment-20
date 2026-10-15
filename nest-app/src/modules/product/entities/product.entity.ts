import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ProductDocument = Product & Document;

@Schema({ timestamps: true })
export class Product {
  _id?: Types.ObjectId;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true, type: Number })
  price: number;

  @Prop({ type: Number, default: 0 })
  discountPercent: number;

  @Prop({ type: Number, default: 0 })
  finalPrice: number;

  @Prop({ type: Number, default: 0 })
  stock: number;

  @Prop({ type: Types.ObjectId, ref: 'Category' })
  categoryId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Brand' })
  brandId: Types.ObjectId;

  @Prop({ type: [String], default: [] })
  gallery: string[];

  @Prop({ type: String, default: '' })
  image: string;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  createdBy: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  updatedBy: Types.ObjectId;
}

export const ProductSchema = SchemaFactory.createForClass(Product);