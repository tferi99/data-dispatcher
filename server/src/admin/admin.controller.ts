import { Controller, forwardRef, Get, Inject } from '@nestjs/common';
import { AppConfig } from '../core/config/config.model';
import { AppConfigService } from '../core/config/app-config/app-config.service';
import { ClientConnectionService } from '../broadcast/client-connection/client-connection.service';
import { ClientConnection } from '../broadcast/client-connection/client-connection.model';
import { MapUtils } from '../core/util/map-utils';

@Controller('admin')
export class AdminController {
  constructor(
    @Inject(forwardRef(() => AppConfigService)) private appConfigService: AppConfigService,
    private clientConnectionService: ClientConnectionService,
  ) {}

  @Get('config')
  async getConfig(): Promise<AppConfig[]> {
    return this.appConfigService.getAll();
  }

  @Get('connections')
  async getConnections(): Promise<ClientConnection[]> {
    return MapUtils.mapToArray(this.clientConnectionService.getAll());
  }
}
