import { Column, Entity, Index } from 'typeorm';

@Index('SYS_C00513079', ['periodo', 'tipoDte'], { unique: true })
@Entity('DTE_DOCUMENTOS_GENERADOS')
export class DteDocumentosGenerados {
  @Column('varchar2', { primary: true, name: 'TIPO_DTE', length: 2 })
  tipoDte: string;

  @Column('number', {
    name: 'CORRELATIVO',
    nullable: true,
    precision: 6,
    scale: 0,
  })
  correlativo: number | null;

  @Column('number', { primary: true, name: 'PERIODO', precision: 4, scale: 0 })
  periodo: number;
}
