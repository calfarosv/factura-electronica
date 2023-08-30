import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { DteContingenciasDetalleDte } from '.';
import { DteCuerposDocumentos } from '.';
import { DteApendices } from '.';
import { DteEmisor } from '.';
import { DteExtensiones } from '.';
import { DteIdentificaciones } from '.';
import { DteResumenes } from '.';
import { DteVentasTerceros } from '.';
import { DteDocumentosRelacionados } from '.';
import { DteDocumentosRespuestas } from '.';
import { DteLotesDetalleDte } from '.';
import { DteOtrosDocumentos } from '.';

@Index('AK_DTE_DOCUMENTO_TBLORICOD', ['tblOrigen', 'tblCodigo'], {
  unique: true,
})
@Index('SYS_C00512973', ['id'], { unique: true })
@Entity('DTE_DOCUMENTOS')
export class DteDocumentos {
  @PrimaryGeneratedColumn({
    type: 'number',
    name: 'ID',
  })
  id: number;

  @Column('clob', { name: 'PDF_DTE', nullable: true })
  pdfDte: string | null;

  @Column('date', {
    name: 'FECHA_CREA',
    nullable: true,
    default: () => 'CURRENT_DATE',
  })
  fechaCrea: Date | null;

  @Column('number', { name: 'RECEPTOR_ID', precision: 8, scale: 0 })
  receptorId: number;

  @Column('varchar2', { name: 'TBL_ORIGEN', nullable: true, length: 3 })
  tblOrigen: string | null;

  @Column('number', {
    name: 'TBL_CODIGO',
    nullable: true,
    precision: 12,
    scale: 0,
  })
  tblCodigo: number | null;

  @Column('date', { name: 'FECHA_MODI', nullable: true })
  fechaModi: Date | null;

  @Column('varchar2', { name: 'ESTADO', nullable: true, length: 3 })
  estado: string | null;

  @Column('clob', { name: 'JSON_DTE', nullable: true })
  jsonDte: string | null;

  @Column('varchar2', { name: 'SELLO_RECEPCION', nullable: true, length: 36 })
  selloRecepcion: string | null;

  @Column('varchar2', { name: 'ORIGEN_DTE', length: 3, default: () => "'INT'" })
  origenDte: string;

  @Column('varchar2', { name: 'USER_CREA', nullable: true, length: 30 })
  userCrea: string | null;

  @Column('varchar2', { name: 'USER_MODI', nullable: true, length: 30 })
  userModi: string | null;

  @Column('clob', { name: 'FIRMA_ELECTRONICA', nullable: true })
  firmaElectronica: string | null;

  @OneToMany(
    () => DteContingenciasDetalleDte,
    (dteContingenciasDetalleDte) => dteContingenciasDetalleDte.documento,
  )
  dteContingenciasDetalleDtes: DteContingenciasDetalleDte[];

  @OneToMany(
    () => DteCuerposDocumentos,
    (dteCuerposDocumentos) => dteCuerposDocumentos.documento,
  )
  dteCuerposDocumentos: DteCuerposDocumentos[];

  @ManyToOne(() => DteApendices, (dteApendices) => dteApendices.dteDocumentos)
  @JoinColumn([{ name: 'APENDICE_ID', referencedColumnName: 'id' }])
  apendice: DteApendices;

  @ManyToOne(() => DteEmisor, (dteEmisor) => dteEmisor.dteDocumentos)
  @JoinColumn([{ name: 'EMISOR_ID', referencedColumnName: 'id' }])
  emisor: DteEmisor;

  @ManyToOne(
    () => DteExtensiones,
    (dteExtensiones) => dteExtensiones.dteDocumentos,
  )
  @JoinColumn([{ name: 'EXTENSION_ID', referencedColumnName: 'id' }])
  extension: DteExtensiones;

  @ManyToOne(
    () => DteIdentificaciones,
    (dteIdentificaciones) => dteIdentificaciones.dteDocumentos,
  )
  @JoinColumn([{ name: 'IDENTIFICACION_ID', referencedColumnName: 'id' }])
  identificacion: DteIdentificaciones;

  @ManyToOne(() => DteResumenes, (dteResumenes) => dteResumenes.dteDocumentos)
  @JoinColumn([{ name: 'RESUMEN_ID', referencedColumnName: 'id' }])
  resumen: DteResumenes;

  @ManyToOne(
    () => DteVentasTerceros,
    (dteVentasTerceros) => dteVentasTerceros.dteDocumentos,
  )
  @JoinColumn([{ name: 'VENTA_TERCERO_ID', referencedColumnName: 'id' }])
  ventaTercero: DteVentasTerceros;

  @OneToMany(
    () => DteDocumentosRelacionados,
    (dteDocumentosRelacionados) => dteDocumentosRelacionados.documento,
  )
  dteDocumentosRelacionados: DteDocumentosRelacionados[];

  @OneToMany(
    () => DteDocumentosRespuestas,
    (dteDocumentosRespuestas) => dteDocumentosRespuestas.documento,
  )
  dteDocumentosRespuestas: DteDocumentosRespuestas[];

  @OneToMany(
    () => DteLotesDetalleDte,
    (dteLotesDetalleDte) => dteLotesDetalleDte.documento,
  )
  dteLotesDetalleDtes: DteLotesDetalleDte[];

  @OneToMany(
    () => DteOtrosDocumentos,
    (dteOtrosDocumentos) => dteOtrosDocumentos.documento,
  )
  dteOtrosDocumentos: DteOtrosDocumentos[];
}
