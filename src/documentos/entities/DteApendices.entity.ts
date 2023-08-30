import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { DteDocumentos } from '.';

@Index('SYS_C00512948', ['id'], { unique: true })
@Entity('DTE_APENDICES')
export class DteApendices {
  @Column('varchar2', { name: 'ETIQUETA', length: 50 })
  etiqueta: string;

  @Column('varchar2', { name: 'CAMPO', length: 25 })
  campo: string;

  @PrimaryGeneratedColumn({
    type: 'number',
    name: 'ID',
  })
  id: number;

  @Column('varchar2', { name: 'VALOR', length: 150 })
  valor: string;

  @OneToMany(() => DteDocumentos, (dteDocumentos) => dteDocumentos.apendice)
  dteDocumentos: DteDocumentos[];
}
