import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { DteDocumentos } from '.';

@Index('SYS_C00512992', ['id'], { unique: true })
@Entity('DTE_OTROS_DOCUMENTOS')
export class DteOtrosDocumentos {
  @Column('varchar2', {
    name: 'MEDICO_DOC_IDENTIFICACION',
    nullable: true,
    length: 25,
  })
  medicoDocIdentificacion: string | null;

  @Column('varchar2', { name: 'MEDICO_NIT', nullable: true, length: 14 })
  medicoNit: string | null;

  @Column('number', {
    name: 'MEDICO_TIPO_SERVICIO',
    nullable: true,
    precision: 1,
    scale: 0,
  })
  medicoTipoServicio: number | null;

  @Column('varchar2', { name: 'DESC_DOCUMENTO', nullable: true, length: 100 })
  descDocumento: string | null;

  @Column('varchar2', { name: 'MEDICO_NOMBRE', nullable: true, length: 100 })
  medicoNombre: string | null;

  @Column('varchar2', {
    name: 'DETALLE_DOCUMENTO',
    nullable: true,
    length: 300,
  })
  detalleDocumento: string | null;

  @PrimaryGeneratedColumn({
    type: 'number',
    name: 'ID',
  })
  id: number;

  @Column('number', { name: 'COD_DOC_ASOCIADO', precision: 1, scale: 0 })
  codDocAsociado: number;

  @ManyToOne(
    () => DteDocumentos,
    (dteDocumentos) => dteDocumentos.dteOtrosDocumentos,
  )
  @JoinColumn([{ name: 'DOCUMENTO_ID', referencedColumnName: 'id' }])
  documento: DteDocumentos;
}
