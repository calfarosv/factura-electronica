import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { DteContingenciasDetalleDte } from '.';

@Index('SYS_C00513055', ['id'], { unique: true })
@Entity('DTE_CONTINGENCIAS')
export class DteContingencias {
  @Column('varchar2', {
    name: 'EMISO_COD_ESTABLE_MH',
    nullable: true,
    length: 4,
  })
  emisoCodEstableMh: string | null;

  @Column('varchar2', {
    name: 'MOTIV_MOTIVO_CONTINGENCIA',
    nullable: true,
    length: 500,
  })
  motivMotivoContingencia: string | null;

  @Column('timestamp', {
    name: 'IDENT_FECHA_TRANSMISION',
    scale: 6,
    default: () => 'CURRENT_TIMESTAMP',
  })
  identFechaTransmision: Date;

  @Column('timestamp', {
    name: 'MOTIV_FECHA_INICIO',
    scale: 6,
    default: () => 'CURRENT_TIMESTAMP',
  })
  motivFechaInicio: Date;

  @Column('varchar2', {
    name: 'EMISO_TELEFONO',
    nullable: true,
    length: 26,
    default: () => 'NULL',
  })
  emisoTelefono: string | null;

  @Column('clob', { name: 'RESPUESTA_MH', nullable: true })
  respuestaMh: string | null;

  @Column('date', { name: 'FECHA_MODI', nullable: true })
  fechaModi: Date | null;

  @Column('varchar2', { name: 'EMISO_CORREO', length: 100 })
  emisoCorreo: string;

  @Column('varchar2', {
    name: 'EMISO_NOMBRE_RESPONSABLE',
    nullable: true,
    length: 100,
    default: () => 'NULL',
  })
  emisoNombreResponsable: string | null;

  @Column('clob', { name: 'DOCUMENTOS_FIRMADOS', nullable: true })
  documentosFirmados: string | null;

  @Column('varchar2', { name: 'USER_MODI', nullable: true, length: 30 })
  userModi: string | null;

  @Column('varchar2', {
    name: 'EMISO_COD_PUNTO_VENTA',
    nullable: true,
    length: 15,
  })
  emisoCodPuntoVenta: string | null;

  @PrimaryGeneratedColumn({
    type: 'number',
    name: 'ID',
  })
  id: number;

  @Column('timestamp', {
    name: 'MOTIV_FECHA_FIN',
    scale: 6,
    default: () => 'CURRENT_TIMESTAMP',
  })
  motivFechaFin: Date;

  @Column('varchar2', { name: 'EMISO_TIPO_ESTABLECIMIENTO', length: 2 })
  emisoTipoEstablecimiento: string;

  @Column('varchar2', { name: 'USER_CREA', nullable: true, length: 30 })
  userCrea: string | null;

  @Column('varchar2', {
    name: 'EMISO_NOMBRE',
    nullable: true,
    length: 150,
    default: () => 'NULL',
  })
  emisoNombre: string | null;

  @Column('number', {
    name: 'IDENT_VERSION',
    precision: 1,
    scale: 0,
    default: () => '2',
  })
  identVersion: number;

  @Column('varchar2', { name: 'IDENT_CODIGO_GENERACION', length: 36 })
  identCodigoGeneracion: string;

  @Column('varchar2', {
    name: 'IDENT_AMBIENTE',
    length: 2,
    default: () => "'01'",
  })
  identAmbiente: string;

  @Column('varchar2', { name: 'ESTADO', nullable: true, length: 3 })
  estado: string | null;

  @Column('varchar2', { name: 'EMISO_TIPO_DOC_RESPONSABLE', length: 2 })
  emisoTipoDocResponsable: string;

  @Column('varchar2', {
    name: 'EMISO_NIT',
    nullable: true,
    length: 14,
    default: () => 'NULL',
  })
  emisoNit: string | null;

  @Column('number', { name: 'MOTIV_TIPO_CONTINGENCIA', precision: 1, scale: 0 })
  motivTipoContingencia: number;

  @Column('varchar2', { name: 'EMISO_NUMERO_DOC_RESPONSABLE', length: 2 })
  emisoNumeroDocResponsable: string;

  @Column('date', {
    name: 'FECHA_CREA',
    nullable: true,
    default: () => 'CURRENT_DATE',
  })
  fechaCrea: Date | null;

  @OneToMany(
    () => DteContingenciasDetalleDte,
    (dteContingenciasDetalleDte) => dteContingenciasDetalleDte.contingencia,
  )
  dteContingenciasDetalleDtes: DteContingenciasDetalleDte[];
}
