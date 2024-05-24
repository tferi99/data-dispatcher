import { forwardRef, Inject, Injectable, Logger } from '@nestjs/common';
import { ClientConnection } from './client-connection.model';
import { INIT_LOG_PREFIX } from '../../core/init.model';
import { TraceService } from '../../core/trace/trace.service';
import { RoleBit } from '../../auth/auth.model';
import { Trace } from '../../core/trace/trace.model';

@Injectable()
export class ClientConnectionService {
  private readonly logger = new Logger(ClientConnectionService.name);
  private connections: Map<string, ClientConnection> = new Map<string, ClientConnection>();

  constructor(@Inject(forwardRef(() => TraceService)) private traceService: TraceService) {}

  async init(): Promise<void> {
    this.logger.log(INIT_LOG_PREFIX + this.constructor.name + ' initializing...');
    this.logger.log(INIT_LOG_PREFIX + this.constructor.name + ' initialized');
  }

  getAll(): Map<string, ClientConnection> {
    return this.connections;
  }

  get(socketId: string): ClientConnection {
    return this.connections.get(socketId);
  }

  /**
   * New SocketIO connection has been added because new client application activated on in a browser tab.
   *
   * @param socketId
   * @param clientIp
   * @param requestHeaders
   */
  add(socketId: string, clientIp: string, requestHeaders: { [key: string]: string | undefined }) {
    if (this.traceService.isTraceEnabled(Trace.ClientConnections)) {
      this.traceService.verbose(this.logger, Trace.ClientConnections, `ClientConnectionService.add(${socketId})`);
    }

    // initial connection
    const conn: ClientConnection = {
      socketId,
      clientIp,
      roles: RoleBit.None,
      requestHeaders,
    };
    this.connections.set(socketId, conn);
  }

  /**
   * Browser(tab) closed and SocketIO connection has been removed.
   *
   * @param socketId
   */
  remove(socketId: string) {
    if (this.traceService.isTraceEnabled(Trace.ClientConnections)) {
      this.traceService.verbose(this.logger, Trace.ClientConnections, `ClientConnectionService.remove(${socketId})`);
    }

    this.connections.delete(socketId);
  }
}
