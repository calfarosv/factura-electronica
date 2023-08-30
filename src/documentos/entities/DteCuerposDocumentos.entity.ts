import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { DteDocumentos } from '.';

@Index('SYS_C00512982', ['id'], { unique: true })
@Entity('DTE_CUERPOS_DOCUMENTOS')
export class DteCuerposDocumentos {
  @Column('varchar2', { name: 'NUMERO_DOCUMENTO', nullable: true, length: 36 })
  numeroDocumento: string | null;

  @Column('date', { name: 'FECHA_INICIO', nullable: true })
  fechaInicio: Date | null;

  @Column('number', {
    name: 'MONTO_DESCU',
    nullable: true,
    precision: 20,
    scale: 8,
  })
  montoDescu: number | null;

  @Column('varchar2', { name: 'COD_TRIBUTO', nullable: true, length: 2 })
  codTributo: string | null;

  @Column('number', {
    name: 'SUB_TOTAL',
    nullable: true,
    precision: 14,
    scale: 2,
  })
  subTotal: number | null;

  @Column('number', {
    name: 'NUM_ITEM',
    nullable: true,
    precision: 3,
    scale: 0,
  })
  numItem: number | null;

  @Column('number', {
    name: 'CANTIDAD_DOC',
    nullable: true,
    precision: 12,
    scale: 0,
  })
  cantidadDoc: number | null;

  @Column('date', { name: 'FECHA_FIN', nullable: true })
  fechaFin: Date | null;

  @Column('number', {
    name: 'UNI_MEDIDA',
    nullable: true,
    precision: 2,
    scale: 0,
  })
  uniMedida: number | null;

  @Column('number', {
    name: 'TIPO_DONACION',
    nullable: true,
    precision: 1,
    scale: 0,
  })
  tipoDonacion: number | null;

  @Column('varchar2', { name: 'CODIGO', nullable: true, length: 25 })
  codigo: string | null;

  @Column('varchar2', {
    name: 'CODIGO_RETENCION_MH',
    nullable: true,
    length: 2,
  })
  codigoRetencionMh: string | null;

  @Column('number', {
    name: 'TIPO_DOC',
    nullable: true,
    precision: 1,
    scale: 0,
  })
  tipoDoc: number | null;

  @Column('varchar2', {
    name: 'DESCRIP_SIN_PERCEPCION',
    nullable: true,
    length: 100,
  })
  descripSinPercepcion: string | null;

  @Column('number', {
    name: 'IVA_PERCIBIDO',
    nullable: true,
    precision: 14,
    scale: 2,
  })
  ivaPercibido: number | null;

  @Column('number', {
    name: 'MONTO_SIN_PERCEPCION',
    nullable: true,
    precision: 14,
    scale: 2,
  })
  montoSinPercepcion: number | null;

  @Column('number', {
    name: 'MONTO_SUJETO_GRAV',
    nullable: true,
    precision: 14,
    scale: 2,
  })
  montoSujetoGrav: number | null;

  @Column('number', {
    name: 'DEPRECIACION',
    nullable: true,
    precision: 20,
    scale: 8,
  })
  depreciacion: number | null;

  @Column('varchar2', {
    name: 'RESUMEN_TRIBUTOS_ITEM',
    nullable: true,
    length: 100,
  })
  resumenTributosItem: string | null;

  @Column('number', {
    name: 'IVA_ITEM',
    nullable: true,
    precision: 20,
    scale: 8,
  })
  ivaItem: number | null;

  @Column('number', {
    name: 'PRECIO_UNI',
    nullable: true,
    precision: 20,
    scale: 8,
  })
  precioUni: number | null;

  @Column('number', {
    name: 'IVA_RETENIDO',
    nullable: true,
    precision: 14,
    scale: 2,
  })
  ivaRetenido: number | null;

  @Column('number', {
    name: 'COMISION',
    nullable: true,
    precision: 14,
    scale: 2,
  })
  comision: number | null;

  @Column('number', {
    name: 'TIPO_ITEM',
    nullable: true,
    precision: 1,
    scale: 0,
  })
  tipoItem: number | null;

  @Column('number', {
    name: 'NO_GRAVADO',
    nullable: true,
    precision: 20,
    scale: 8,
  })
  noGravado: number | null;

  @Column('varchar2', { name: 'TIPO_DTE', nullable: true, length: 2 })
  tipoDte: string | null;

  @Column('number', { name: 'IVA', nullable: true, precision: 20, scale: 8 })
  iva: number | null;

  @Column('number', {
    name: 'MONTO_SUJETO_PERCEPCION',
    nullable: true,
    precision: 14,
    scale: 2,
  })
  montoSujetoPercepcion: number | null;

  @Column('number', {
    name: 'LIQUIDO_APAGAR',
    nullable: true,
    precision: 14,
    scale: 2,
  })
  liquidoApagar: number | null;

  @Column('number', {
    name: 'CANTIDAD',
    nullable: true,
    precision: 20,
    scale: 8,
  })
  cantidad: number | null;

  @Column('number', {
    name: 'VENTA_EXENTA',
    nullable: true,
    precision: 20,
    scale: 8,
  })
  ventaExenta: number | null;

  @Column('number', {
    name: 'VALOR_UNI',
    nullable: true,
    precision: 20,
    scale: 8,
  })
  valorUni: number | null;

  @Column('varchar2', { name: 'OBSERVACION', nullable: true, length: 3000 })
  observacion: string | null;

  @Column('number', {
    name: 'VENTA_NO_SUJ',
    nullable: true,
    precision: 20,
    scale: 8,
  })
  ventaNoSuj: number | null;

  @Column('number', { name: 'PSV', nullable: true, precision: 20, scale: 8 })
  psv: number | null;

  @Column('number', { name: 'COMPRA', nullable: true, precision: 14, scale: 2 })
  compra: number | null;

  @Column('varchar2', { name: 'PORCENT_COMISION', nullable: true, length: 100 })
  porcentComision: string | null;

  @Column('number', {
    name: 'EXPORTACIONES',
    nullable: true,
    precision: 20,
    scale: 8,
  })
  exportaciones: number | null;

  @Column('number', {
    name: 'VENTA_GRAVADA',
    nullable: true,
    precision: 20,
    scale: 8,
  })
  ventaGravada: number | null;

  @Column('number', {
    name: 'TIPO_GENERACION',
    nullable: true,
    precision: 1,
    scale: 0,
  })
  tipoGeneracion: number | null;

  @Column('varchar2', { name: 'COD_LIQUIDACION', nullable: true, length: 30 })
  codLiquidacion: string | null;

  @Column('number', {
    name: 'IVA_COMISION',
    nullable: true,
    precision: 14,
    scale: 2,
  })
  ivaComision: number | null;

  @Column('number', { name: 'VALOR', nullable: true, precision: 20, scale: 8 })
  valor: number | null;

  @PrimaryGeneratedColumn({
    type: 'number',
    name: 'ID',
  })
  id: number;

  @Column('date', { name: 'FECHA_GENERACION', nullable: true })
  fechaGeneracion: Date | null;

  @Column('number', {
    name: 'VALOR_OPERACIONES',
    nullable: true,
    precision: 14,
    scale: 2,
  })
  valorOperaciones: number | null;

  @ManyToOne(
    () => DteDocumentos,
    (dteDocumentos) => dteDocumentos.dteCuerposDocumentos,
  )
  @JoinColumn([{ name: 'DOCUMENTO_ID', referencedColumnName: 'id' }])
  documento: DteDocumentos;
}
