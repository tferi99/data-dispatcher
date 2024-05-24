import { forwardRef, Module } from '@nestjs/common';
import { BroadcastGateway } from './broadcast.gateway';
import { TraceModule } from '../core/trace/trace.module';
import { ConfigModule } from '../core/config/config.module';
import { EnvUtils } from '../core/util/env-utils';
import { ClientConnectionService } from './client-connection/client-connection.service';

@Module({
  imports: [TraceModule, forwardRef(() => ConfigModule)],
  providers: [BroadcastGateway, ClientConnectionService],
  exports: [ClientConnectionService, BroadcastGateway],
})
export class BroadcastModule {}
