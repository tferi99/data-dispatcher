import { SocketIoConfig } from 'ngx-socket-io';
import { environment } from '../../../environments/environment';

export const WEBSOCKET_CONFIG: SocketIoConfig = {
  url: environment.wsUrl, // same as port in proxy.config.json
  options: {},
};
