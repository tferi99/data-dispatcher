import { Module } from '@nestjs/common';
import { WebhookController } from './webhook.controller';
import { BroadcastModule } from '../broadcast/broadcast.module';

@Module({
  imports: [BroadcastModule],
  controllers: [WebhookController],
})
export class WebhookModule {}
