import { Injectable } from '@nestjs/common';
import { CreateMessageDto } from './chat.dto';

@Injectable()
export class ChatService {
  private messages: CreateMessageDto[] = [];

  createMessage(createMessageDto: CreateMessageDto) {
    this.messages.push(createMessageDto);
    return createMessageDto;
  }

  findAllMessagesForUser(userId: string) {
    return this.messages.filter(
      (msg) => msg.senderId === userId || msg.receiverId === userId,
    );
  }
}
