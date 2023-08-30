import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { DteResumenes } from '.';

@Index('SYS_C00512964', ['id'], { unique: true })
@Entity('DTE_RESUMEN_PAGOS')
export class DteResumenPagos {
  @Column('number', { name: 'PERIODO', nullable: true, precision: 4, scale: 0 })
  periodo: number | null;

  @PrimaryGeneratedColumn({
    type: 'number',
    name: 'ID',
  })
  id: number;

  @Column('varchar2', { name: 'CODIGO', length: 2 })
  codigo: string;

  @Column('number', { name: 'MONTO_PAGO', precision: 14, scale: 2 })
  montoPago: number;

  @Column('varchar2', { name: 'REFERENCIA', nullable: true, length: 300 })
  referencia: string | null;

  @Column('varchar2', { name: 'PLAZO', nullable: true, length: 2 })
  plazo: string | null;

  @ManyToOne(() => DteResumenes, (dteResumenes) => dteResumenes.dteResumenPagos)
  @JoinColumn([{ name: 'RESUMEN_ID', referencedColumnName: 'id' }])
  resumen: DteResumenes;
}
