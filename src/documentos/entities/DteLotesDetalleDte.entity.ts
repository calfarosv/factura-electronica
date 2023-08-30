import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { DteDocumentos } from '.';
import { DteLotes } from '.';

@Index('SYS_C00513072', ['id'], { unique: true })
@Entity('DTE_LOTES_DETALLE_DTE')
export class DteLotesDetalleDte {
  @Column('varchar2', { name: 'ESTADO', nullable: true, length: 3 })
  estado: string | null;

  @PrimaryGeneratedColumn({
    type: 'number',
    name: 'ID',
  })
  id: number;

  @Column('clob', { name: 'RESPUESTA_MH', nullable: true })
  respuestaMh: string | null;

  @ManyToOne(
    () => DteDocumentos,
    (dteDocumentos) => dteDocumentos.dteLotesDetalleDtes,
  )
  @JoinColumn([{ name: 'DOCUMENTO_ID', referencedColumnName: 'id' }])
  documento: DteDocumentos;

  @ManyToOne(() => DteLotes, (dteLotes) => dteLotes.dteLotesDetalleDtes)
  @JoinColumn([{ name: 'LOTE_ID', referencedColumnName: 'id' }])
  lote: DteLotes;
}
