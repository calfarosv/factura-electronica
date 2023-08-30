import { Column, Entity, Index } from 'typeorm';

@Index('SYS_C00513088', ['ambiente'], { unique: true })
@Entity('DTE_PARAMETROS_GLOBALES')
export class DteParametrosGlobales {
  @Column('number', {
    name: 'TIPO_CONTINGENCIA',
    nullable: true,
    precision: 1,
    scale: 0,
  })
  tipoContingencia: number | null;

  @Column('varchar2', { name: 'MOTIVO_CONTIN', nullable: true, length: 150 })
  motivoContin: string | null;

  @Column('varchar2', {
    primary: true,
    name: 'AMBIENTE',
    length: 2,
    default: () => "'01'",
  })
  ambiente: string;
}
