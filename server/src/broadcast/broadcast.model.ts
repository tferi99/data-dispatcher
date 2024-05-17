export enum WsEvent {
  Connected = 'connected',
  Error = 'error',
  //general
  Ping = 'ping',
  Pong = 'pong',
  Exception = 'exception', // sent when WsException thrown
}
