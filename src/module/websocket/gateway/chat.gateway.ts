import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { WebSocketNamespace } from '../enum/websocket-namespace.enum';
import { BaseGateway } from './base.gateway';
import { WebSocketEvents } from '../enum/websocket-events.enum';
import { JsonParsePipe } from '../pipe/json-parse.pipe';

@WebSocketGateway({
  cors: { origin: '*' },
  namespace: WebSocketNamespace.CHAT,
  transports: ['websocket'],
})
export class ChatGateway extends BaseGateway {
  @SubscribeMessage(WebSocketEvents.SEND_MESSAGE)
  async handlerSendMessage(
    @MessageBody(JsonParsePipe) payload: { message: string; from: string },
    @ConnectedSocket() client: Socket,
  ) {
    const userClient = this.getClientById(payload.from);
    this.logger.log(`Send message: To [${client.id}] from [${payload.from}]`);
    userClient.emit(WebSocketEvents.NEW_MESSAGE, {
      ...payload,
      from: client.id,
    });
  }

  @SubscribeMessage(WebSocketEvents.SEND_MESSAGE_ALL)
  async handlerSendMessageAll(
    @MessageBody(JsonParsePipe) payload: { message: string; from: string },
    @ConnectedSocket() client: Socket,
  ) {
    this.logger.log(`Send message: To [${client.id}] from [ALL]`);
    this.broadcast(WebSocketEvents.NEW_MESSAGE, {
      ...payload,
      to: client.id,
    });
  }
}
