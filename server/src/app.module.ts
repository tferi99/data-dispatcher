import { Logger, Module } from '@nestjs/common';
import { WebhookModule } from './webhook/webhook.module';
import { BroadcastModule } from './broadcast/broadcast.module';
import { APP_FILTER } from '@nestjs/core';
import { GlobalExceptionFilter } from './core/filter/global-exception.filter';
import { EnvUtils } from './core/util/env-utils';
import { INIT_LOG_PREFIX } from './core/init.model';

@Module({
  imports: [WebhookModule, BroadcastModule],
  controllers: [],
  providers: [
    Logger, // for default logger

    // global error handling
    {
      provide: APP_FILTER,
      useClass: GlobalExceptionFilter,
    },
  ],
})
export class AppModule {
  private readonly logger = new Logger(AppModule.name);

  constructor() {
    const port = EnvUtils.getNumberValue('SERVER_PORT');
    this.logger.log(INIT_LOG_PREFIX + 'Application started on port: ' + port);
  }
}
