import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { DteDocumentos } from '.';

@Index('SYS_C00512943', ['id'], { unique: true })
@Entity('DTE_EXTENSIONES')
export class DteExtensiones {
  @Column('varchar2', { name: 'OBSERVACIONES', nullable: true, length: 3000 })
  observaciones: string | null;

  @Column('varchar2', { name: 'PLACA_VEHICULO', nullable: true, length: 10 })
  placaVehiculo: string | null;

  @Column('varchar2', { name: 'DOCU_RECIBE', nullable: true, length: 25 })
  docuRecibe: string | null;

  @Column('varchar2', { name: 'NOMB_RECIBE', nullable: true, length: 100 })
  nombRecibe: string | null;

  @PrimaryGeneratedColumn({
    type: 'number',
    name: 'ID',
  })
  id: number;

  @Column('varchar2', { name: 'NOMB_ENTREGA', nullable: true, length: 100 })
  nombEntrega: string | null;

  @Column('varchar2', { name: 'DOCU_ENTREGA', nullable: true, length: 25 })
  docuEntrega: string | null;

  @OneToMany(() => DteDocumentos, (dteDocumentos) => dteDocumentos.extension)
  dteDocumentos: DteDocumentos[];
}
