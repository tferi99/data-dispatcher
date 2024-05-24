import { Body, Controller, Get, Post } from '@nestjs/common';
import { BroadcastGateway } from '../broadcast/broadcast.gateway';
import { WsEvent } from '../broadcast/broadcast.model';

export interface GeneralData {
  data?: string;
}

@Controller('webhook')
export class WebhookController {
  constructor(private broadcastGateway: BroadcastGateway) {}
  @Post('general')
  receiveData(@Body() data: GeneralData) {
    this.broadcastGateway.broadcast(WsEvent.General, data);
  }
}
