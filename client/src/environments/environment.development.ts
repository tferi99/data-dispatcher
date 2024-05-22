import { NgxLoggerLevel } from 'ngx-logger';

export const environment = {
  production: false,

  logLevel: NgxLoggerLevel.TRACE,
  serverLogLevel: NgxLoggerLevel.OFF,

  wsUrl: 'http://localhost:10000',
};
