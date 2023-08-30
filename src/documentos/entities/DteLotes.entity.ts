import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { DteLotesDetalleDte } from '.';

@Index('SYS_C00513068', ['id'], { unique: true })
@Entity('DTE_LOTES')
export class DteLotes {
  @Column('clob', { name: 'RESPUESTA_MH', nullable: true })
  respuestaMh: string | null;

  @Column('clob', { name: 'DOCUMENTO_FIRMADO', nullable: true })
  documentoFirmado: string | null;

  @PrimaryGeneratedColumn({
    type: 'number',
    name: 'ID',
  })
  id: number;

  @Column('varchar2', { name: 'ESTADO', nullable: true, length: 30 })
  estado: string | null;

  @OneToMany(
    () => DteLotesDetalleDte,
    (dteLotesDetalleDte) => dteLotesDetalleDte.lote,
  )
  dteLotesDetalleDtes: DteLotesDetalleDte[];
}
