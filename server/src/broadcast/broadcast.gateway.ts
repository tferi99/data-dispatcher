import { OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer, WsResponse } from '@nestjs/websockets';
import { forwardRef, Inject, Logger, UseFilters } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { WsEvent } from './broadcast.model';
import { GlobalWsExceptionsFilter } from '../core/filter/global-ws-exception.filter';
import { INIT_LOG_PREFIX } from '../core/init.model';
import { TraceService } from '../core/trace/trace.service';
import { AppConfigService } from '../core/config/app-config/app-config.service';
import { Trace } from '../core/trace/trace.model';

@WebSocketGateway({
  cors: true,
  //  cors: { origin: 'https://hoppscotch2.io' },
  //  cors: { origin: 'http://localhost:4220' },
})
@UseFilters(new GlobalWsExceptionsFilter())
export class BroadcastGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  private readonly logger = new Logger(BroadcastGateway.name);

  @WebSocketServer() wsServer: Server;

  constructor(
    @Inject(forwardRef(() => TraceService)) private traceService: TraceService,
    @Inject(forwardRef(() => AppConfigService)) private appConfigService: AppConfigService,
  ) {}

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  afterInit(server: Server): any {
    this.logger.log(INIT_LOG_PREFIX + 'WebSocket gateway initialized');
  }

  /**
   * Called by NestJS WebSocketGateway framework on socket connection.
   *
   * VERY IMPORTANT TO HANDLE ERRORS HERE!!!
   * Otherwise application may crash.
   *
   * SEE ALSO:  https://github.com/nestjs/nest/issues/2028
   */
  handleConnection(socket: Socket): void {
    try {
      if (this.traceService.isTraceEnabled(Trace.WebSocket)) {
        this.traceService.verbose(this.logger, Trace.WebSocket, `WS client[${socket.id}] connected from ${socket.handshake.address}`);
        this.traceService.verbose(this.logger, Trace.WebSocket, 'HEADER[host]: ' + socket.request.headers['host']);
        this.traceService.verbose(this.logger, Trace.WebSocket, 'HEADER[user-agent]: ' + socket.request.headers['user-agent']);
      }
    } catch (err: any) {
      const msg = `Error occured in handleConnection(client[${socket.id}])`;
      this.logger.error(msg, err);
      const errMsg = err instanceof Error ? err.message : '?';
      this.disconnect(socket, msg + ' : ' + errMsg);
    }
  }

  /**
   * Called by NestJS WebSocketGateway framework on socket disconnection.
   *
   * @param socket
   */
  handleDisconnect(socket: Socket): void {
    if (this.traceService.isTraceEnabled(Trace.WebSocket)) {
      this.traceService.verbose(this.logger, Trace.WebSocket, `WS client[${socket.id}] disconnected`);
    }
  }

  @SubscribeMessage(WsEvent.Ping)
  handlePing(socket: Socket, payload: any): WsResponse<string> {
    this.traceWsReceive(WsEvent.Ping, socket, payload);
    this.traceWsSend(WsEvent.Pong, socket, payload);
    return { event: WsEvent.Pong, data: payload };
  }

  // -------------------------------- broadcast --------------------------------
  /**
   * To broadcast SocketIO messages to clients.
   * You can send global messages for a room.
   *
   * NOTE:
   *    Don't call this message broadcasting method directly.
   *    {@link ClientConnectionService} wraps this method and adds some
   * @param eventId
   * @param data
   * @param room
   */
  broadcast(eventId: string, data: any, room?: string) {
    if (room) {
      this.broadcastToRoom(eventId, data, room);
    } else {
      this.broadcastToAll(eventId, data);
    }
  }

  private broadcastToAll(eventId: string, data: any) {
    if (this.traceService.isTraceEnabled(Trace.WebSocket)) {
      this.traceService.verbose(this.logger, Trace.WebSocket, `Broadcast[${eventId}]`, data);
    }
    this.wsServer.emit(eventId, data);
  }

  private broadcastToRoom(eventId: string, data: any, room: string) {
    if (this.traceService.isTraceEnabled(Trace.WebSocket)) {
      this.traceService.verbose(this.logger, Trace.WebSocket, `Broadcast[${eventId}] to room[${room}]`, data);
    }
    this.wsServer.to(room).emit(eventId, data);
  }

  disconnect(socket: Socket, reason: string) {
    if (this.traceService.isTraceEnabled(Trace.WebSocket)) {
      this.traceService.verbose(this.logger, Trace.WebSocket, `Disconnecting client[${socket.id}] - reason:${reason}`);
    }
    socket.emit(WsEvent.Error, 'Disconnected. Reason:' + reason);
    socket.disconnect();
  }

  logout(socketId: string, user: string) {
    if (this.traceService.isTraceEnabled(Trace.WebSocket)) {
      this.traceService.verbose(this.logger, Trace.WebSocket, `Logout client[${socketId}] => leaving room[${user}]`);
    }
    const socket = this.wsServer.sockets.sockets.get(socketId);
    if (socket) {
      const room = user;
      socket.leave(room);
      if (this.traceService.isTraceEnabled(Trace.WebSocket)) {
        this.traceService.verbose(this.logger, Trace.WebSocket, `Client[${socket.id}] left user Room[${room}]`);
      }
    } else {
      if (this.traceService.isTraceEnabled(Trace.WebSocket)) {
        this.traceService.warn(this.logger, Trace.WebSocket, `Logout cancelled, client[${socketId}] not found`);
      }
    }
  }

  //----------------------------------------------- helpers -----------------------------------------------
  private traceWsReceive(ev: WsEvent, socket: Socket, payload?: any) {
    if (this.traceService.isTraceEnabled(Trace.WebSocket)) {
      this.traceService.verbose(this.logger, Trace.WebSocket, `<<<<<<<<<< [${ev}] client[${socket.id}]`, payload);
    }
  }

  private traceWsSend(ev: WsEvent, socket: Socket, payload?: any) {
    if (this.traceService.isTraceEnabled(Trace.WebSocket)) {
      this.traceService.verbose(this.logger, Trace.WebSocket, `>>>>>>>>>> [${ev}] client[${socket.id}]`, payload);
    }
  }
}
