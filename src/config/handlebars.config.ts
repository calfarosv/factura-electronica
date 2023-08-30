/* eslint-disable prettier/prettier */
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { ExpressHandlebars } from 'express-handlebars';

export function configureHandlebars(app: NestExpressApplication) {
    const handlebars = new ExpressHandlebars({
        extname: '.hbs',
        layoutsDir: join(__dirname, '..',  'views', 'layouts'),
        partialsDir: join(__dirname, '..',  'views', 'partials'),
        defaultLayout: 'factura',
        //helpers: require('../hbs-helpers'),
      });
    
  app.engine(
    'hbs',handlebars.engine
  );

  app.set('view engine', 'hbs');
  app.set('views', join(__dirname, '..', 'views'));
}
