import { Logger } from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { WebSocketEvents } from '../enum/websocket-events.enum';

export abstract class BaseGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  protected readonly logger = new Logger(BaseGateway.name);

  @WebSocketServer()
  server: Server;

  private connectedClients = new Map<string, Socket>();

  handleConnection(client: Socket) {
    this.logger.log(`Client Connected: ${client.id}`);
    this.connectedClients.set(client.id, client);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client Disconnected: ${client.id}`);
    this.connectedClients.delete(client.id);
  }

  getClientById(clientId: string) {
    return this.connectedClients.get(clientId);
  }

  // TODO?: Criar tipo do Payload
  broadcast(event: WebSocketEvents, payload: any) {
    this.server.emit(event, payload);
  }
}
