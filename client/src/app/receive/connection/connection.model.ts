export interface ConnectionInfo {
  connected: boolean;
  socketId?: string;
  connectErrors: number;
  disconnectedAt: number;
  lastConnectError: number;
}
