import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { BroadcastGateway } from './broadcast.gateway';
import { WsEvent } from './broadcast.model';

@Injectable()
export class BoadcastService {
  constructor(@Inject(forwardRef(() => BroadcastGateway)) private broadcastGateway: BroadcastGateway) {}

  broadcast(event: WsEvent, data: any, room?: string) {
    this.broadcastGateway.broadcast(event.toString(), data, room);
  }
}
