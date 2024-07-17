import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";

import { Socket, Server } from "socket.io";
import { ChatService } from "./chat.service";
import { CreateMessageDto } from "./chat.dto";

@WebSocketGateway(3002, { cors: { origin: "*" } })
export class ChatGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    constructor(private readonly chatService: ChatService) {}

    @WebSocketServer() server: Server;

    afterInit(server: Server) {
        this.server = server;
      }
    
      handleConnection(client: Socket) {
        console.log(`Client connected: ${client.id}`);
      }
    
      handleDisconnect(client: Socket) {
        console.log(`Client disconnected: ${client.id}`);
      }
    
      @SubscribeMessage('sendMessage')
      async handleMessage(
        @MessageBody() createMessageDto: CreateMessageDto,
      ) {
        const message = await this.chatService.createMessage(createMessageDto);
        this.server.to(createMessageDto.receiverId).emit('receiveMessage', message);
      }
    
      @SubscribeMessage('joinRoom')
      handleJoinRoom(@MessageBody() roomId: string, @ConnectedSocket() client: Socket) {
        client.join(roomId);
      }
}