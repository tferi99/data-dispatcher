import { Module } from '@nestjs/common';
import { BroadcastGateway } from './broadcast.gateway';

@Module({
  providers: [
    BroadcastGateway
  ]
})
export class BroadcastModule {}
