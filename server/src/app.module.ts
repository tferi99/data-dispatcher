import { Logger, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { WebhookModule } from './webhook/webhook.module';
import { BroadcastModule } from './broadcast/broadcast.module';
import { APP_FILTER } from '@nestjs/core';
import { GlobalExceptionFilter } from './core/filter/global-exception.filter';

@Module({
  imports: [WebhookModule, BroadcastModule],
  controllers: [AppController],
  providers: [
    Logger, // for default logger

    // global error handling
    {
      provide: APP_FILTER,
      useClass: GlobalExceptionFilter,
    },
  ],
})
export class AppModule {}
