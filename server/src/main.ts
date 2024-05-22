// loading .env
import { config } from 'dotenv';
config({}); // it should be called after importing .env

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { WinstonModule } from 'nest-winston';
import { LoggingConfig } from './config/logging.config';
import { DevUtils } from './core/util/dev-utils';
import { EnvUtils } from './core/util/env-utils';

const PORT = EnvUtils.getNumberValue('SERVER_PORT');
/**
 *  Documentation: https://github.com/winstonjs/winston
 *
 *  Normally Winston can handle unhanled exceptipns and rejections
 *  but in this application this solution cannot work and application crashes.
 *  That't the reason why I handle+log rejections in main.ts manually.
 */
/**
 * To fix unhandled exceptions which can crash application
 * if thrown from an async function called without await.
 *
 * SEE ALSO: https://stackoverflow.com/questions/64341200/how-to-fix-unhandled-promise-rejection-warning-in-nestjs
 */
const rejectionLogger = WinstonModule.createLogger(LoggingConfig.REJECTIONS);
process.on('unhandledRejection', (err: Error) => {
  DevUtils.printErrorStackTrace('UNHANDLED REJECTION:', err);
  DevUtils.logErrorStackTrace(rejectionLogger, err);
});

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(PORT);
}
bootstrap();
