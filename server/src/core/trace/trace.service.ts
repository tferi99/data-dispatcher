import { Injectable, Logger } from '@nestjs/common';
import { EnvUtils } from '../util/env-utils';
import { Trace } from './trace.model';
import { AppConfigService } from '../config/app-config/app-config.service';
import { AppConfigId } from '../config/config.model';
import { EnumUtils } from '../util/enum-utils';

/**
 * It puts trace messages into log if trace enabled for the feature.
 * Features are in Trace enum.
 *
 * Message starting with prefix '=[FEATURE]='
 *
 * IMPORTANT NOTE:
 *  TraceService should be initialized before first call.
 *  It depends on AppConfigService and it can/should be initialized only AFTER AppConfigService initialized.
 *
 */
@Injectable()
export class TraceService {
  private readonly logger = new Logger(TraceService.name);

  private inited = false;

  /**
   * Global semaphore from .env
   */
  private traceDisabled = false;

  constructor(private appConfigService: AppConfigService) {
    this.traceDisabled = EnvUtils.getBooleanValue('TRACE_DISABLED');
    if (this.traceDisabled) {
      this.logger.debug('!!!!!!!!!!!!!!!!!!!!!!!!! Tracing disabled !!!!!!!!!!!!!!!!!!!!!!!!!');
    }
  }

  isTraceEnabled(trace: Trace) {
    if (this.traceDisabled) {
      return false;
    }
    if (!this.inited) {
      this.logger.warn(`TraceService called but not inited yet (${trace})`);
      return false;
    }
    return this.appConfigService.getBoolean(String(trace) as AppConfigId);
  }

  private isDataEnabled(trace: Trace) {
    if (!this.inited) {
      return false;
    }
    return this.appConfigService.getBoolean((String(trace) + '_DATA') as AppConfigId);
  }

  verbose(logger: Logger, feature: Trace, msg: string, data?: any) {
    logger.verbose(this.getMessage(feature, msg, data));
    this.logData(logger, feature, data);
  }

  error(logger: Logger, feature: Trace, msg: string, data?: any) {
    logger.error(this.getMessage(feature, msg, data));
    this.logData(logger, feature, data);
  }

  warn(logger: Logger, feature: Trace, msg: string, data?: any) {
    logger.warn(this.getMessage(feature, msg, data));
    this.logData(logger, feature, data);
  }

  log(logger: Logger, feature: Trace, msg: string, data?: any) {
    logger.log(this.getMessage(feature, msg, data));
    this.logData(logger, feature, data);
  }

  //------------------------------- helpers -------------------------------
  private getMessage(feature: Trace, msg: string, data?: any): string {
    if (data === undefined || data === null) {
      return this.getLogPrefix(feature) + msg;
    }
    return this.getLogPrefix(feature) + msg + ' (+data)';
  }

  private getLogPrefix(feature: Trace): string {
    return '====================[' + feature + ']====================|';
  }

  private dumpTraceSettings() {
    this.logger.debug('------- Trace settings -------');
    for (const trace of EnumUtils.enumKeys(Trace)) {
      const val = Trace[trace];
      const traceEnabled = this.isTraceEnabled(val as Trace);
      this.logger.debug(`Tracing ${trace}: ${traceEnabled}`);
    }
    this.logger.debug('------------------------------');
  }

  private data2string(data: any) {
    if (data === undefined || data === null) {
      return '';
    }
    //const type = typeof data;
    if (typeof data === 'object' || Array.isArray(data)) {
      return JSON.stringify(data, null, 2);
    }
    return String(data);
  }

  private logData(logger: Logger, feature: Trace, data?: any): void {
    if (data === undefined || data === null) {
      return;
    }
    //    DevUtils.printStackTrace();
    if (!this.isDataEnabled(feature)) {
      return;
    }
    logger.debug(this.getLogPrefix(feature) + 'DATA: ' + this.data2string(data));
  }
}
