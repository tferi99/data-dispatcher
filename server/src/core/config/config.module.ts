import { forwardRef, Module } from '@nestjs/common';
import { AppConfigService } from './app-config/app-config.service';
import { TraceModule } from '../trace/trace.module';

@Module({
  imports: [forwardRef(() => TraceModule)],
  providers: [AppConfigService],
  exports: [AppConfigService],
})
export class ConfigModule {}
