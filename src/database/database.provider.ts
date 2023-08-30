import { DynamicModule } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
//import { Environment } from 'src/common';
import { Environment } from 'src/common';
import { DteEmisor } from 'src/documentos/entities';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

export const DatabaseProvider: DynamicModule = TypeOrmModule.forRootAsync({
  inject: [ConfigService],
  useFactory: (config: ConfigService) => ({
    type: 'oracle',
    //host: 'desa.cel.gob.sv',
    connectString: config.get('DB_CONECTION'),
    port: +config.get('DB_PORT'),
    username: config.get('DB_USERNAME'),
    password: config.get('DB_PASSWORD'),
    database: config.get('DB_DATABASE'),
    schema: config.get('DB_SCHEMA'),
    entities: [__dirname + '/../**/**/*.entity{.ts,.js}'],
    //entities: [DteEmisor],
    synchronize: false,
    logging: config.get('NODE_ENV') !== Environment.Production,
    namingStrategy: new SnakeNamingStrategy(),
  }),
});
