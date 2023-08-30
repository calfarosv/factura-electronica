import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { DteDocumentos } from '.';

@Index('SYS_C00512921', ['id'], { unique: true })
@Entity('DTE_EMISOR')
export class DteEmisor {
  @PrimaryGeneratedColumn({
    type: 'number',
    name: 'ID',
  })
  id: number;

  @Column('varchar2', {
    name: 'NOMBRE_COMERCIAL',
    nullable: true,
    length: 150,
    default: () => 'NULL',
  })
  nombreComercial: string | null;

  @Column('varchar2', { name: 'CORREO', length: 100 })
  correo: string;

  @Column('varchar2', { name: 'DESC_ACTIVIDAD', length: 150 })
  descActividad: string;

  @Column('varchar2', {
    name: 'RECINTO_FISCAL',
    nullable: true,
    length: 2,
    default: () => 'NULL',
  })
  recintoFiscal: string | null;

  @Column('varchar2', {
    name: 'TIPO_DOC_RESPONSABLE',
    nullable: true,
    length: 2,
    default: () => 'NULL',
  })
  tipoDocResponsable: string | null;

  @Column('varchar2', { name: 'TIPO_ESTABLECIMIENTO', length: 2 })
  tipoEstablecimiento: string;

  @Column('varchar2', {
    name: 'COD_PUNTO_VENTA_MH',
    nullable: true,
    length: 4,
    default: () => 'NULL',
  })
  codPuntoVentaMh: string | null;

  @Column('varchar2', {
    name: 'COD_PUNTO_VENTA',
    nullable: true,
    length: 15,
    default: () => 'NULL',
  })
  codPuntoVenta: string | null;

  @Column('varchar2', { name: 'COD_ACTIVIDAD', length: 6 })
  codActividad: string;

  @Column('varchar2', { name: 'NOMBRE', length: 250 })
  nombre: string;

  @Column('varchar2', { name: 'COMPLEMENTO', length: 200 })
  complemento: string;

  @Column('varchar2', {
    name: 'NUMERO_DOC_RESPONSABLE',
    nullable: true,
    length: 25,
    default: () => 'NULL',
  })
  numeroDocResponsable: string | null;

  @Column('varchar2', {
    name: 'COD_ESTABLE_MH',
    nullable: true,
    length: 4,
    default: () => 'NULL',
  })
  codEstableMh: string | null;

  @Column('number', {
    name: 'TIPO_ITEM_EXPOR',
    precision: 1,
    scale: 0,
    default: () => '1',
  })
  tipoItemExpor: number;

  @Column('varchar2', { name: 'NRC', length: 8 })
  nrc: string;

  @Column('varchar2', { name: 'TELEFONO', length: 30 })
  telefono: string;

  @Column('varchar2', { name: 'MUNICIPIO', length: 2 })
  municipio: string;

  @Column('varchar2', { name: 'NIT', length: 14 })
  nit: string;

  @Column('varchar2', {
    name: 'NOMBRE_RESPONSABLE',
    nullable: true,
    length: 100,
    default: () => 'NULL',
  })
  nombreResponsable: string | null;

  @Column('varchar2', { name: 'DEPARTAMENTO', length: 2 })
  departamento: string;

  @Column('varchar2', {
    name: 'REGIMEN',
    nullable: true,
    length: 13,
    default: () => 'NULL',
  })
  regimen: string | null;

  @Column('varchar2', {
    name: 'COD_ESTABLE',
    nullable: true,
    length: 10,
    default: () => 'NULL',
  })
  codEstable: string | null;

  @OneToMany(() => DteDocumentos, (dteDocumentos) => dteDocumentos.emisor)
  dteDocumentos: DteDocumentos[];
}
