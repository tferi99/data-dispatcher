import { Auth, TokenInfo } from '../../auth/auth.model';

export interface ClientConnection {
  socketId: string;
  clientIp: string;
  roles: number; // bits from RoleBit for performance - calculated from auth.roles
  auth?: Auth;
  tokenInfo?: TokenInfo;
  requestHeaders: { [key: string]: string };
}
