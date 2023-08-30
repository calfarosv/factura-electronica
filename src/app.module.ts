import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
//import { Trp_Dpe_Entity } from './permiso/entities/trp_dpe_entity';
//import { Trp_Pei_Entity } from './permiso/entities/trp_pei_entity';
//import { PermisoModule } from './permiso/permiso.module';
//import { UsersModule } from './users/users.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
//import { Trp_Emp_V_Entity } from './permiso/entities/trp_emp_v_entity';
import { ConfigModule } from '@nestjs/config';
//import { Trp_Emj_V_Entity } from './permiso/entities/trp_emj_empjef_v';

@Module({
  imports: [//AuthModule, UsersModule, //PermisoModule,
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'oracle',
      connectString: process.env.ORA_CONECTION,
      port: parseInt(process.env.ORA_PORT),
      username: process.env.ORA_USERNAME,
      password: process.env.ORA_PASSWORD,
      database: process.env.ORA_DATABASE,
      logging: true,
      schema: '',
      //entities: [Trp_Pei_Entity, Trp_Dpe_Entity, Trp_Emp_V_Entity,Trp_Emj_V_Entity],
    }),
    MailerModule.forRootAsync({
      useFactory: () => ({
        transport: {
          host: process.env.HOST_MAIL,
          port: parseInt(process.env.PORT_MAIL),
          secure: Boolean(JSON.parse(process.env.SECURE_MAIL)),
        },
        defaults: {
          from: '"nest-modules" <modules@nestjs.com>',
        },


        template: {
          dir: process.cwd() + '/templates/', // __dirname + '/templates', //dir: process.cwd() + 'src/templates',
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true,
          },
        },

      }),
    }),


  ],
  controllers: [AppController],
  providers: [AppService],
})


export class AppModule { }


/*
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
*/