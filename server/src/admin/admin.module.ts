import { forwardRef, Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { ConfigModule } from '../core/config/config.module';

@Module({
  imports: [forwardRef(() => ConfigModule)],
  controllers: [AdminController],
})
export class AdminModule {}
