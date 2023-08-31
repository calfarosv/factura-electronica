import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { Logger, ValidationPipe } from '@nestjs/common';
import { CORS } from './constants';
import * as path from 'path';
//import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppContextService } from './documentos/services/app.context.service';
import { setupSwagger } from './config/swagger.config';
import { configureHandlebars } from './config/handlebars.config';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  const logger = new Logger('Bootstrap');

  const configService = app.get(ConfigService);
  const nodeEnv = process.env.NODE_ENV;

  app.enableCors(CORS);

  app.setGlobalPrefix('api-dte');

  setupSwagger(app);

  const appContextService = app.get(AppContextService);

  app.use((req, res, next) => {
    appContextService.setServerUrl(req);
    next();
  });

  app.useStaticAssets(path.join(__dirname, '..', 'src', 'public'), {
    prefix: '/static',
    index: false,
    extensions: ['jpg', 'jpeg', 'png', 'gif', 'svg'],
  });

  app.setBaseViewsDir(path.join(__dirname, '..', 'src', 'views'));
  configureHandlebars(app);

  await app.listen(configService.get('PORT') || 3000);

  const templateDir = path.resolve(__dirname, '..', 'src', 'mail', 'templates');
  logger.log(templateDir);
  logger.log(`Server is running in ${nodeEnv} at ${await app.getUrl()}`);
}
bootstrap();


/*
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import * as fs from 'fs';
import { AppModule } from './app.module';
import { initSwagger } from './app.swagger';

//const crPath = '/opt/nodejscert/server.cert';
//const pkPath = '/opt/nodejscert/server.key';
const crPath = 'server.cert';
const pkPath = 'server.key';
let httpsOptions: any = {};

async function bootstrap() {
  if (fs.existsSync(crPath) && fs.existsSync(pkPath)) {
    httpsOptions = {
      cert: fs.readFileSync(crPath),
      key: fs.readFileSync(pkPath)
    }
  }
  const app = await NestFactory.create(AppModule, { httpsOptions });
//console.log('httpsOptions: ',httpsOptions);
  initSwagger(app);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    })
  );

  app.enableCors();
  await app.listen(3090);
  //await app.listen(3008, '127.0.0.1');

}
bootstrap();
*/


/*
import { initSwagger } from './app.swagger';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  initSwagger(app);
  
  app.useGlobalPipes(
  new ValidationPipe({
    whitelist: true,
  }),
  );
  app.enableCors();
  await app.listen(3016);
}
bootstrap();
*/