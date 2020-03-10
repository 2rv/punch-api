import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import * as helmet from 'helmet';
import * as config from 'config';
import * as rateLimit from 'express-rate-limit';

async function bootstrap() {
  const serverConfig = config.get('server');
  const port = process.env.PORT || serverConfig.port;

  const app = await NestFactory.create(AppModule);

  app.enableCors();
  app.use(helmet());
  app.use(
    rateLimit({
      windowMs: 3 * 60 * 1000, // 15 minutes
      max: 100, // limit each IP to 100 requests per windowMs
    }),
  );
  // app.useGlobalInterceptors(new LoggingInterceptor());

  await app.listen(port);

  const logger = new Logger('BootstrapServer');
  logger.log(`Application listening on port ${port}`);
  logger.log(`Server URL is http://localhost:${port}`);
}
bootstrap();
