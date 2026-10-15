import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';

@WebSocketGateway({ cors: { origin: '*' } })
export class RealtimeGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server;

  constructor(private jwtService: JwtService) {}

  async handleConnection(client: Socket) {
    try {
      const token =
        client.handshake.auth?.token ||
        client.handshake.headers?.authorization?.split(' ')[1];
      if (!token) {
        client.disconnect();
        return;
      }
      const user = this.jwtService.verify(token, {
        secret: process.env.JWT_SECRET || 'mySuperSecretKey123',
      });
      client.data.user = user;
      console.log(`User connected: ${user.id}`);
    } catch (err) {
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    console.log(`User disconnected: ${client.data?.user?.id}`);
  }

  @SubscribeMessage('sayHi')
  handleSayHi(
    @MessageBody() message: string,
    @ConnectedSocket() client: Socket,
  ) {
    console.log('Message received:', message);
    client.emit('sayHi', `Hello from BE: ${message}`);
  }
}