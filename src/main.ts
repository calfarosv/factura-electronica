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