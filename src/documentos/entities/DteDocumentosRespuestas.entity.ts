import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { DteDocumentos } from '.';

@Index('SYS_C00513077', ['id'], { unique: true })
@Entity('DTE_DOCUMENTOS_RESPUESTAS')
export class DteDocumentosRespuestas {
  @PrimaryGeneratedColumn({
    type: 'number',
    name: 'ID',
  })
  id: number;

  @Column('clob', { name: 'OBSERVACIONES', nullable: true })
  observaciones: string | null;

  @Column('varchar2', { name: 'ESTADO', nullable: true, length: 3 })
  estado: string | null;

  @ManyToOne(
    () => DteDocumentos,
    (dteDocumentos) => dteDocumentos.dteDocumentosRespuestas,
  )
  @JoinColumn([{ name: 'DOCUMENTO_ID', referencedColumnName: 'id' }])
  documento: DteDocumentos;
}
