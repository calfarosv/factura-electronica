import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { DteDocumentos } from '.';

@Index('SYS_C00512940', ['id'], { unique: true })
@Entity('DTE_VENTAS_TERCEROS')
export class DteVentasTerceros {
  @Column('varchar2', { name: 'NOMBRE', length: 200 })
  nombre: string;

  @PrimaryGeneratedColumn({
    type: 'number',
    name: 'ID',
  })
  id: number;

  @Column('varchar2', { name: 'NIT', length: 14 })
  nit: string;

  @OneToMany(() => DteDocumentos, (dteDocumentos) => dteDocumentos.ventaTercero)
  dteDocumentos: DteDocumentos[];
}
