import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { DteDocumentos } from '.';

@Index('SYS_C00513003', ['id'], { unique: true })
@Entity('DTE_DOCUMENTOS_RELACIONADOS')
export class DteDocumentosRelacionados {
  @PrimaryGeneratedColumn({
    type: 'number',
    name: 'ID',
  })
  id: number;

  @Column('number', { name: 'TIPO_GENERACION', precision: 1, scale: 0 })
  tipoGeneracion: number;

  @Column('varchar2', { name: 'NUMERO_DOCUMENTO', length: 36 })
  numeroDocumento: string;

  @Column('varchar2', { name: 'TIPO_DOCUMENTO', length: 2 })
  tipoDocumento: string;

  @Column('date', { name: 'FECHA_EMISION' })
  fechaEmision: Date;

  @ManyToOne(
    () => DteDocumentos,
    (dteDocumentos) => dteDocumentos.dteDocumentosRelacionados,
  )
  @JoinColumn([{ name: 'DOCUMENTO_ID', referencedColumnName: 'id' }])
  documento: DteDocumentos;
}
