import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { DteDocumentos } from '.';

@Index('SYS_C00512900', ['id'], { unique: true })
@Entity('DTE_IDENTIFICACIONES')
export class DteIdentificaciones {
  @Column('varchar2', {
    name: 'MOTIVO_CONTIN',
    nullable: true,
    length: 150,
    default: () => 'NULL',
  })
  motivoContin: string | null;

  @PrimaryGeneratedColumn({
    type: 'number',
    name: 'ID',
  })
  id: number;

  @Column('number', {
    name: 'TIPO_OPERACION',
    precision: 1,
    scale: 0,
    default: () => '1',
  })
  tipoOperacion: number;

  @Column('number', {
    name: 'TIPO_MODELO',
    precision: 1,
    scale: 0,
    default: () => '1',
  })
  tipoModelo: number;

  @Column('varchar2', { name: 'AMBIENTE', length: 2, default: () => "'01'" })
  ambiente: string;

  @Column('varchar2', {
    name: 'TIPO_MONEDA',
    length: 3,
    default: () => "'USD'",
  })
  tipoMoneda: string;

  @Column('number', {
    name: 'VERSION',
    precision: 1,
    scale: 0,
    default: () => '3',
  })
  version: number;

  @Column('varchar2', { name: 'TIPO_DTE', length: 2 })
  tipoDte: string;

  @Column('varchar2', { name: 'NUMERO_CONTROL', length: 31 })
  numeroControl: string;

  @Column('timestamp', {
    name: 'FECHA_EMISION',
    scale: 6,
    default: () => 'CURRENT_TIMESTAMP',
  })
  fechaEmision: Date;

  @Column('number', {
    name: 'TIPO_CONTINGENCIA',
    nullable: true,
    precision: 1,
    scale: 0,
    default: () => 'NULL',
  })
  tipoContingencia: number | null;

  @Column('varchar2', { name: 'CODIGO_GENERACION', length: 36 })
  codigoGeneracion: string;

  @OneToMany(
    () => DteDocumentos,
    (dteDocumentos) => dteDocumentos.identificacion,
  )
  dteDocumentos: DteDocumentos[];
}
