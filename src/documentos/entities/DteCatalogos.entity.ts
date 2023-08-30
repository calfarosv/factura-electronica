import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Index('DTE_CATALOGOS_PK', ['id'], { unique: true })
@Entity('DTE_CATALOGOS')
export class DteCatalogos {
  @PrimaryGeneratedColumn({ type: 'number', name: 'ID' })
  id: number;

  @Column('number', { name: 'DTE_PADRE', nullable: true })
  dtePadre: number | null;

  @Column('varchar2', { name: 'DTE_CODIGO', length: 20 })
  dteCodigo: string;

  @Column('varchar2', { name: 'DTE_DESCRIPCION', nullable: true, length: 1024 })
  dteDescripcion: string | null;

  @Column('varchar2', { name: 'DTE_HOMOLOGACION', nullable: true, length: 20 })
  dteHomologacion: string | null;

  @Column('varchar2', { name: 'DTE_NOMBRE', length: 255 })
  dteNombre: string;
}
