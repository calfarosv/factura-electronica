import { DynamicModule } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import * as path from 'path';

export const MailProvider: DynamicModule = MailerModule.forRootAsync({
  inject: [ConfigService],
  useFactory: (config: ConfigService) => ({
    transport: {
      host: config.get('HOST_MAIL'),
      port: parseInt(config.get('PORT_MAIL')),
      secure: Boolean(JSON.parse(config.get('SECURE_MAIL'))),
    },
    defaults: {
      from: '"nest-modules" <modules@nestjs.com>',
    },
    template: {
      dir: path.resolve(__dirname, '..', 'mail', 'email-template'), // __dirname + '/templates', //dir: process.cwd() + 'src/templates',
      adapter: new HandlebarsAdapter(),
      options: {
        strict: true,
      },
    },
  }),
});
