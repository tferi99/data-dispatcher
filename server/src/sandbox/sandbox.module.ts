import { forwardRef, Module } from '@nestjs/common';
import { SandboxController } from './sandbox.controller';
import { TraceModule } from '../core/trace/trace.module';

@Module({
  imports: [forwardRef(() => TraceModule)],
  controllers: [SandboxController],
})
export class SandboxModule {}
