import { Controller, Get } from '@nestjs/common';
import { NodeUtils } from './core/util/node-utils';

@Controller()
export class AppController {
  @Get()
  welcome(): string {
    return '################################# data-dispatcher #################################';
  }
}
