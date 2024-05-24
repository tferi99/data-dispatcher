import { forwardRef, Module } from '@nestjs/common';
import { InitService } from './init.service';
import { ConfigModule } from '../core/config/config.module';
import { TraceModule } from '../core/trace/trace.module';
import { BroadcastModule } from '../broadcast/broadcast.module';

@Module({
  imports: [
    forwardRef(() => ConfigModule),
    forwardRef(() => TraceModule),
    BroadcastModule
  ],
  providers: [InitService],
  exports: [InitService],
})
export class InitModule {}
