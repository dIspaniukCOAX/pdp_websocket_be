import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';
import { CreateMessageDto } from './chat.dto';
import { Req } from '@nestjs/common';

@WebSocketGateway(3002, { cors: { origin: '*' } })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(private readonly chatService: ChatService) {}

  @WebSocketServer() server: Server;

  private getRoomName(user1: number, user2: number): string {
    return [user1, user2].sort().join('-');
  }

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);

    client.broadcast.emit('user-joined', {
      message: `New user joined: ${client.id}`,
    });
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);

    this.server.emit('user-disconnected', {
      message: `The user left: ${client.id}`,
    });
  }

  @SubscribeMessage('message')
  handleMessage(
    @MessageBody() createMessageDto: CreateMessageDto,
    @ConnectedSocket() client: Socket,
  ) {
    const { senderId, receiverId } = JSON.parse(createMessageDto as unknown as string);
    const message = this.chatService.createMessage(createMessageDto);
    const room = this.getRoomName(
      senderId,
      receiverId,
    );
    this.server.to(room).emit('message', message);
  }

  @SubscribeMessage('joinRoom')
  handleJoinRoom(
    @MessageBody() createMessageDto: CreateMessageDto,
    @ConnectedSocket() client: Socket,
  ) {

    const room = this.getRoomName(createMessageDto?.senderId, createMessageDto?.receiverId);
    client.join(room);
  }
}
