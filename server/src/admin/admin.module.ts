import { forwardRef, Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { ConfigModule } from '../core/config/config.module';
import { BroadcastModule } from '../broadcast/broadcast.module';

@Module({
  imports: [forwardRef(() => ConfigModule), BroadcastModule],
  controllers: [AdminController],
})
export class AdminModule {}
