import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ChatDocument = Chat & Document;

@Schema({ _id: false })
export class Message {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  senderId: Types.ObjectId;

  @Prop({ type: String, required: true })
  content: string;

  @Prop({ type: Date, default: Date.now })
  createdAt: Date;
}

export const MessageSchema = SchemaFactory.createForClass(Message);

@Schema({ timestamps: true })
export class Chat {
  _id?: Types.ObjectId;

  @Prop({ type: Boolean, default: false })
  isGroup: boolean;

  @Prop({ type: [Types.ObjectId], ref: 'User', default: [] })
  participants: Types.ObjectId[];

  @Prop({ type: String, default: '' })
  groupName: string;

  @Prop({ type: [MessageSchema], default: [] })
  messages: Message[];
}

export const ChatSchema = SchemaFactory.createForClass(Chat);