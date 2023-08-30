import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { DteResumenes } from '.';

@Index('SYS_C00512957', ['id'], { unique: true })
@Entity('DTE_RESUMEN_TRIBUTOS')
export class DteResumenTributos {
  @Column('number', { name: 'VALOR', precision: 12, scale: 2 })
  valor: number;

  @Column('varchar2', { name: 'DESCRIPCION', length: 300 })
  descripcion: string;

  @Column('varchar2', { name: 'CODIGO', length: 2 })
  codigo: string;

  @PrimaryGeneratedColumn({
    type: 'number',
    name: 'ID',
  })
  id: number;

  @ManyToOne(
    () => DteResumenes,
    (dteResumenes) => dteResumenes.dteResumenTributos,
  )
  @JoinColumn([{ name: 'RESUMEN_ID', referencedColumnName: 'id' }])
  resumen: DteResumenes;
}
