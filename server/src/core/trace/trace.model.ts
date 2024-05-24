/**
 * Traced feature-modules.
 */
export enum Trace {
  AppConfig = 'TRACE_APP_CONFIG',
  ClientConnections = 'TRACE_CLIENT_CONNECTIONS',
  WebSocket = 'TRACE_WEB_SOCKET',
  Events = 'TRACE_EVENTS',
  Broadcast = 'TRACE_BROADCAST',
  Sandbox = 'TRACE_SANDBOX',
}

export const TAG_TRACE_PREFIX = 'Trace;';
