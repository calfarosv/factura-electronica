import {
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { DteContingencias, DteDocumentos } from '.';

@Index('SYS_C00513064', ['id'], { unique: true })
@Entity('DTE_CONTINGENCIAS_DETALLE_DTE')
export class DteContingenciasDetalleDte {
  @PrimaryGeneratedColumn({
    type: 'number',
    name: 'ID',
  })
  id: number;

  @ManyToOne(
    () => DteContingencias,
    (dteContingencias) => dteContingencias.dteContingenciasDetalleDtes,
  )
  @JoinColumn([{ name: 'CONTINGENCIA_ID', referencedColumnName: 'id' }])
  contingencia: DteContingencias;

  @ManyToOne(
    () => DteDocumentos,
    (dteDocumentos) => dteDocumentos.dteContingenciasDetalleDtes,
  )
  @JoinColumn([{ name: 'DOCUMENTO_ID', referencedColumnName: 'id' }])
  documento: DteDocumentos;
}
