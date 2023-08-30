import { Module } from '@nestjs/common';
import { DocumentosService } from './services/documentos.service';
import { DocumentosController } from './controllers/documentos.controller';
import { AppContextService } from './services/app.context.service';
import { HttpModule } from '@nestjs/axios';
import { FirmaServiceService } from './services/firma.service.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  DteCuerposDocumentos,
  DteDocumentos,
  DteEmisor,
  DteIdentificaciones,
  DteResumenes,
} from './entities';
import { CommonsServiceService } from './services/commons.service.service';

@Module({
  imports: [
    HttpModule,
    TypeOrmModule.forFeature([
      DteDocumentos,
      DteIdentificaciones,
      DteEmisor,
      DteCuerposDocumentos,
      DteResumenes,
    ]),
  ],
  providers: [
    DocumentosService,
    AppContextService,
    FirmaServiceService,
    CommonsServiceService,
  ],
  controllers: [DocumentosController],
})
export class DocumentosModule {}


/*
import { Module } from '@nestjs/common';
import { DocumentosController } from './controllers/documentos.controller';
import { DocumentosService } from './services/documentos.service';

@Module({
  controllers: [DocumentosController],
  providers: [DocumentosService]
})
export class DocumentosModule {}
*/