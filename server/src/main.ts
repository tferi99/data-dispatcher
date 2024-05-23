// loading .env
import { config } from 'dotenv';
config({}); // it should be called after importing .env

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { WinstonModule } from 'nest-winston';
import { LoggingConfig } from './config/logging.config';
import { DevUtils } from './core/util/dev-utils';
import { EnvUtils } from './core/util/env-utils';
import { InitService } from './init/init.service';

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
  const app = await NestFactory.create(AppModule, {
    logger: WinstonModule.createLogger(LoggingConfig.MAIN),
    // logger: console,
    //logger: false,
  });

  // swagger
  /*  const options = new DocumentBuilder().setTitle('Cats example').setDescription('The cats API description').setVersion('1.0').addTag('cats').build();
    const document = SwaggerModule.createDocument(app, options);
    SwaggerModule.setup('api', app, document);*/

  //  app.useGlobalInterceptors(new ErrorsInterceptor());

  const initService = app.get(InitService);
  await initService.initApplication();

  await app.listen(PORT);
}
bootstrap();
