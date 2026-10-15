import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Query,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ChatService } from './chat.service';
import { AuthGuard } from '../auth/guards/auth.guard';

@Controller('chat')
@UseGuards(AuthGuard)
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post('create')
  async createChat(@Body() body: { participantId: string }, @Req() req: any) {
    return this.chatService.createOrGetChat(req.user.id, body.participantId);
  }

  @Post('group')
  async createGroup(
    @Body() body: { participants: string[]; groupName: string },
    @Req() req: any,
  ) {
    return this.chatService.createGroupChat(
      req.user.id,
      body.participants,
      body.groupName,
    );
  }

  @Get()
  async getChats(@Req() req: any) {
    return this.chatService.getUserChats(req.user.id);
  }

  @Post(':chatId/message')
  async sendMessage(
    @Param('chatId') chatId: string,
    @Body() body: { content: string },
    @Req() req: any,
  ) {
    return this.chatService.sendMessage(chatId, req.user.id, body.content);
  }

  @Get(':chatId/messages')
  async getMessages(
    @Param('chatId') chatId: string,
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '20',
  ) {
    return this.chatService.getChatMessages(
      chatId,
      parseInt(page),
      parseInt(limit),
    );
  }
}