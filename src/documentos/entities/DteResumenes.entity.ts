import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { DteDocumentos } from '.';
import { DteResumenPagos } from '.';
import { DteResumenTributos } from '.';

@Index('SYS_C00512950', ['id'], { unique: true })
@Entity('DTE_RESUMENES')
export class DteResumenes {
  @Column('number', {
    name: 'TOTAL_NO_GRAVADO',
    nullable: true,
    precision: 14,
    scale: 2,
  })
  totalNoGravado: number | null;

  @Column('varchar2', { name: 'COD_INCOTERMS', nullable: true, length: 20 })
  codIncoterms: string | null;

  @Column('varchar2', { name: 'OBSERVACIONES', nullable: true, length: 3000 })
  observaciones: string | null;

  @Column('number', {
    name: 'SUB_TOTAL',
    nullable: true,
    precision: 14,
    scale: 2,
  })
  subTotal: number | null;

  @Column('number', {
    name: 'TOTAL_IVA_RETENIDO',
    nullable: true,
    precision: 14,
    scale: 2,
  })
  totalIvaRetenido: number | null;

  @Column('number', {
    name: 'SUB_TOTAL_VENTAS',
    nullable: true,
    precision: 14,
    scale: 2,
  })
  subTotalVentas: number | null;

  @Column('number', {
    name: 'DESCU_NO_SUJ',
    nullable: true,
    precision: 14,
    scale: 2,
  })
  descuNoSuj: number | null;

  @Column('number', {
    name: 'PORCENTAJE_DESCUENTO',
    nullable: true,
    precision: 5,
    scale: 2,
  })
  porcentajeDescuento: number | null;

  @Column('number', {
    name: 'RETE_RENTA',
    nullable: true,
    precision: 14,
    scale: 2,
  })
  reteRenta: number | null;

  @Column('number', { name: 'SEGURO', nullable: true, precision: 14, scale: 2 })
  seguro: number | null;

  @Column('varchar2', { name: 'TOTAL_LETRAS', nullable: true, length: 200 })
  totalLetras: string | null;

  @Column('number', {
    name: 'TOTAL_EXENTA',
    nullable: true,
    precision: 14,
    scale: 2,
  })
  totalExenta: number | null;

  @Column('number', {
    name: 'SALDO_FAVOR',
    nullable: true,
    precision: 14,
    scale: 2,
  })
  saldoFavor: number | null;

  @Column('varchar2', {
    name: 'NUM_PAGO_ELECTRONICO',
    nullable: true,
    length: 100,
  })
  numPagoElectronico: string | null;

  @Column('number', {
    name: 'IVA_PERCI1',
    nullable: true,
    precision: 14,
    scale: 2,
  })
  ivaPerci1: number | null;

  @PrimaryGeneratedColumn({
    type: 'number',
    name: 'ID',
  })
  id: number;

  @Column('number', {
    name: 'IVA_RETE1',
    nullable: true,
    precision: 14,
    scale: 2,
  })
  ivaRete1: number | null;

  @Column('number', {
    name: 'TOTAL_PAGAR',
    nullable: true,
    precision: 14,
    scale: 2,
  })
  totalPagar: number | null;

  @Column('number', {
    name: 'CONDICION_OPERACION',
    nullable: true,
    precision: 1,
    scale: 0,
  })
  condicionOperacion: number | null;

  @Column('number', {
    name: 'TOTAL_NO_SUJ',
    nullable: true,
    precision: 14,
    scale: 2,
  })
  totalNoSuj: number | null;

  @Column('number', {
    name: 'DESCU_EXENTA',
    nullable: true,
    precision: 14,
    scale: 2,
  })
  descuExenta: number | null;

  @Column('number', {
    name: 'VALOR_TOTAL',
    nullable: true,
    precision: 14,
    scale: 2,
  })
  valorTotal: number | null;

  @Column('number', {
    name: 'DESCU_GRAVADA',
    nullable: true,
    precision: 14,
    scale: 2,
  })
  descuGravada: number | null;

  @Column('number', {
    name: 'TOTAL_COMPRA',
    nullable: true,
    precision: 14,
    scale: 2,
  })
  totalCompra: number | null;

  @Column('number', { name: 'TOTAL', nullable: true, precision: 14, scale: 2 })
  total: number | null;

  @Column('number', {
    name: 'TOTAL_IVA',
    nullable: true,
    precision: 14,
    scale: 2,
  })
  totalIva: number | null;

  @Column('number', {
    name: 'TOTAL_SUJETO_RETENCION',
    nullable: true,
    precision: 14,
    scale: 2,
  })
  totalSujetoRetencion: number | null;

  @Column('number', {
    name: 'TOTAL_DESCU',
    nullable: true,
    precision: 14,
    scale: 2,
  })
  totalDescu: number | null;

  @Column('number', {
    name: 'IVA_PERCI',
    nullable: true,
    precision: 14,
    scale: 2,
  })
  ivaPerci: number | null;

  @Column('number', {
    name: 'TOTAL_EXPORTACION',
    nullable: true,
    precision: 14,
    scale: 2,
  })
  totalExportacion: number | null;

  @Column('number', { name: 'FLETE', nullable: true, precision: 14, scale: 2 })
  flete: number | null;

  @Column('number', {
    name: 'MONTO_TOTAL_OPERACION',
    nullable: true,
    precision: 14,
    scale: 2,
  })
  montoTotalOperacion: number | null;

  @Column('varchar2', { name: 'DESC_INCOTERMS', nullable: true, length: 150 })
  descIncoterms: string | null;

  @Column('number', {
    name: 'TOTAL_GRAVADA',
    nullable: true,
    precision: 14,
    scale: 2,
  })
  totalGravada: number | null;

  @Column('number', {
    name: 'DESCUENTO',
    nullable: true,
    precision: 14,
    scale: 2,
  })
  descuento: number | null;

  @OneToMany(() => DteDocumentos, (dteDocumentos) => dteDocumentos.resumen)
  dteDocumentos: DteDocumentos[];

  @OneToMany(
    () => DteResumenPagos,
    (dteResumenPagos) => dteResumenPagos.resumen,
  )
  dteResumenPagos: DteResumenPagos[];

  @OneToMany(
    () => DteResumenTributos,
    (dteResumenTributos) => dteResumenTributos.resumen,
  )
  dteResumenTributos: DteResumenTributos[];
}
