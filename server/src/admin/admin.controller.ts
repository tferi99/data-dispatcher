import { Controller, forwardRef, Get, Inject } from '@nestjs/common';
import { AppConfig } from '../core/config/config.model';
import { AppConfigService } from '../core/config/app-config/app-config.service';

@Controller('admin')
export class AdminController {
  constructor(@Inject(forwardRef(() => AppConfigService)) private appConfigService: AppConfigService) {}

  @Get('config')
  async getConfig(): Promise<AppConfig[]> {
    return this.appConfigService.getAll();
  }
}
