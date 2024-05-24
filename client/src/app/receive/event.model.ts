/**
 * Copy from server
 */
export enum WsEvent {
  Connected = 'connected',
  Error = 'error',
  //general
  Ping = 'ping',
  Pong = 'pong',
  Exception = 'exception', // sent when WsException thrown
  GenerateWsError = 'generate_ws_error',
  GenerateError = 'generate_error',
  General = 'general',
}

