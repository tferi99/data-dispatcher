import { Body, Controller, forwardRef, Inject, Logger, Post } from '@nestjs/common';
import { TraceService } from '../core/trace/trace.service';
import { Trace } from '../core/trace/trace.model';

export enum TraceLevel {
  Error = 'error',
  Warn = 'warn',
  Log = 'log',
  Verbose = 'verbose',
}

export interface TracePayload {
  level: TraceLevel;
  message: string;
}

@Controller('sandbox')
export class SandboxController {
  private readonly logger = new Logger(SandboxController.name);

  constructor(@Inject(forwardRef(() => TraceService)) private traceService: TraceService) {}

  @Post('trace')
  trace(@Body() data: TracePayload) {
    switch (data.level) {
      case TraceLevel.Error:
        this.traceService.error(this.logger, Trace.Sandbox, data.message, data);
        break;
      case TraceLevel.Warn:
        this.traceService.warn(this.logger, Trace.Sandbox, data.message, data);
        break;
      case TraceLevel.Log:
        this.traceService.log(this.logger, Trace.Sandbox, data.message, data);
        break;
      case TraceLevel.Verbose:
        this.traceService.verbose(this.logger, Trace.Sandbox, data.message, data);
        break;
      default:
        this.traceService.log(this.logger, Trace.Sandbox, data.message, data);
        break;
    }
  }
}
