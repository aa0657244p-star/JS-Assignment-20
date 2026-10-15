import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Chat, ChatDocument } from './entities/chat.entity';

@Injectable()
export class ChatService {
  constructor(@InjectModel(Chat.name) private chatModel: Model<ChatDocument>) {}

  async createOrGetChat(userId: string, participantId: string) {
    let chat = await this.chatModel.findOne({
      isGroup: false,
      participants: { $all: [userId, participantId] },
    });
    if (!chat) {
      chat = await this.chatModel.create({
        isGroup: false,
        participants: [userId, participantId],
      });
    }
    return chat;
  }

  async createGroupChat(userId: string, participants: string[], groupName: string) {
    return this.chatModel.create({
      isGroup: true,
      participants: [userId, ...participants],
      groupName,
    });
  }

  async getUserChats(userId: string) {
    return this.chatModel
      .find({ participants: userId })
      .populate('participants', 'fname lname email');
  }

  async sendMessage(chatId: string, senderId: string, content: string) {
    const chat = await this.chatModel.findById(chatId);
    if (!chat) throw new NotFoundException('Chat not found');

    chat.messages.push({
      senderId: new Types.ObjectId(senderId),
      content,
      createdAt: new Date(),
    });
    await chat.save();
    return chat;
  }

  async getChatMessages(
    chatId: string,
    page: number = 1,
    limit: number = 20,
  ) {
    const chat = await this.chatModel
      .findById(chatId)
      .populate('messages.senderId', 'fname email');
    if (!chat) throw new NotFoundException('Chat not found');

    const total = chat.messages.length;
    const sorted = chat.messages.sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime(),
    );
    const skip = (page - 1) * limit;
    const paginated = sorted.slice(skip, skip + limit);

    return {
      messages: paginated.reverse(),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }
}