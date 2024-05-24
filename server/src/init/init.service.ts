import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { TraceService } from '../core/trace/trace.service';
import { AppConfigService } from '../core/config/app-config/app-config.service';
import { ClientConnectionService } from '../broadcast/client-connection/client-connection.service';

@Injectable()
export class InitService {
  constructor(
    @Inject(forwardRef(() => AppConfigService)) private appConfigService: AppConfigService,
    @Inject(forwardRef(() => TraceService)) private traceService: TraceService,
    private clientConnectionService: ClientConnectionService,
  ) {}
  async initApplication() {
    // THIS SHOULD BE THE FIRST ONE!!!
    await this.appConfigService.init();

    await this.traceService.init();
    await this.clientConnectionService.init();
  }
}
