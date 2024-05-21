import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { NGXLogger } from 'ngx-logger';
import { WsErrorAction } from '../store/app.actions';
import { AuthReason, Feature, WsEvent } from '@app/client-lib';
import { AuthService } from '../auth/auth.service';
import { Observable, Subscription } from 'rxjs';
import { Socket } from 'ngx-socket-io';
import { AuthorizedAction } from '../auth/store/auth.actions';
import { ConnectedAction, ConnectErrorAction, DisconnectedAction } from './store/connection.actions';

export enum SocketIoReason {
  ConnectError = 'connect_error',
  ConnectFailed = 'connect_failed',
  Disconnect = 'disconnect',
  Error = 'error',
}

@Injectable({
  providedIn: 'root',
})
export class WebSocketService {
  connectedSub?: Subscription;
  pongSub?: Subscription;
  exceptionSub?: Subscription;

  connected$!: Observable<any>;
  authorized$!: Observable<any>;
  pong$!: Observable<any>;
  exception$!: Observable<any>;

  private _socketId?: string;
  private _authService!: AuthService;

  constructor(
    private socket: Socket,
    private store: Store,
    private logger: NGXLogger,
  ) {
    this.init();
  }

  private init() {
    this.logger.log('Init');
    this.cleanup();

    this.connected$ = this.socket.fromEvent<any>(WsEvent.Connected);
    this.authorized$ = this.socket.fromEvent<any>(WsEvent.Authorized);
    this.pong$ = this.socket.fromEvent<any>(WsEvent.Pong);
    this.exception$ = this.socket.fromEvent<any>(WsEvent.Exception);

    // handlers
    this.connected$.subscribe({
      next: (socketId: string) => {
        this.handleConnected(socketId);
      },
    });
    this.authorized$.subscribe({
      next: (reason: AuthReason) => {
        this.handleAuthorized(reason);
      },
    });
    this.pong$.subscribe({
      next: (msg: string) => {
        this.handlePong(msg);
      },
    });
    this.exception$.subscribe({
      next: (payload: any) => {
        this.handleException(payload);
      },
    });

    this.socket.ioSocket.on(SocketIoReason.ConnectError, (err: any) => this.handleErrors(SocketIoReason.ConnectError, err));
    this.socket.ioSocket.on(SocketIoReason.ConnectFailed, (err: any) => this.handleErrors(SocketIoReason.ConnectFailed, err));
    this.socket.ioSocket.on(SocketIoReason.Disconnect, (err: any) => this.handleErrors(SocketIoReason.Disconnect, err));
    this.socket.ioSocket.on(SocketIoReason.Error, (err: any) => this.handleErrors(SocketIoReason.Error, err));
  }

  private cleanup() {
    this.logger.log('Cleanup');
    if (this.connectedSub) {
      this.connectedSub.unsubscribe();
      this.connectedSub = undefined;
    }
    if (this.pongSub) {
      this.pongSub.unsubscribe();
      this.pongSub = undefined;
    }
    if (this.exceptionSub) {
      this.exceptionSub.unsubscribe();
      this.exceptionSub = undefined;
    }
  }

  connect() {
    this.socket.connect();
  }

  disconnect() {
    this.socket.disconnect();
  }

  get socketId(): string | undefined {
    return this._socketId;
  }

  // --------------------------- send messages ---------------------------
  ping(msg: string): void {
    console.log('WebSocket Ping sent: ' + msg);
    this.sendData(WsEvent.Ping, msg);
  }

  pingWithAuth(msg: string): void {
    console.log('WebSocket PingWithAuth sent: ' + msg);
    this.sendData(WsEvent.PingWithAuth, msg);
  }

  pingAdminOnly(msg: string): void {
    console.log('WebSocket PingAdminOnly sent: ' + msg);
    this.sendData(WsEvent.PingAdminOnly, msg);
  }

  addFeature(feature: Feature): void {
    this.sendData(WsEvent.AddFeature, feature);
  }

  removeFeature(feature: Feature): void {
    this.sendData(WsEvent.RemoveFeature, feature);
  }

  generateWsError(data: string): void {
    this.sendData(WsEvent.GenerateWsError, 'data');
  }

  generateError(data: string): void {
    this.sendData(WsEvent.GenerateError, 'data');
  }

  sendData(messageId: string, data: any) {
    this.socket.emit(messageId, data);
  }

  // --------------------------- message handlers ---------------------------
  private handlePong(msg: string) {
    console.log('WebSocket PONG received:', msg);
  }

  private handleConnected(socketId: string) {
    this.logger.debug(`WebSocket Client[${socketId}] connected.`);
    this._socketId = socketId;
    this.store.dispatch(ConnectedAction({ socketId }));
  }

  private handleErrors(reason: string, err: any) {
    console.log(`SOCKET-IO ERROR[${reason}]:`, err);

    if (reason === SocketIoReason.Disconnect) {
      this.store.dispatch(DisconnectedAction());
    } else if (reason === SocketIoReason.ConnectError) {
      this.store.dispatch(ConnectErrorAction());
    }
  }

  private handleAuthorized(reason: AuthReason) {
    this.store.dispatch(AuthorizedAction({ reason }));
  }

  /*  private handleCounter(counter-value: number) {
    console.log('WebSocket COUNTER received:', counter-value);
    this.store.dispatch(SetServerCounterAction({value: counter-value}));
  }*/

  private handleException(payload: any) {
    this.logger.error('EXCEPTION FROM WS: ', payload);
    this.store.dispatch(WsErrorAction({ payload }));
  }
}
