import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Index('SYS_C00513029', ['id'], { unique: true })
@Entity('DTE_INVALIDACIONES')
export class DteInvalidaciones {
  @Column('varchar2', {
    name: 'EMISO_NOM_ESTABLECIMIENTO',
    nullable: true,
    length: 150,
  })
  emisoNomEstablecimiento: string | null;

  @Column('varchar2', { name: 'DOCUM_NOMBRE', length: 200 })
  documNombre: string;

  @Column('timestamp', {
    name: 'IDENT_FEC_HOR_ANULA',
    scale: 6,
    default: () => 'CURRENT_TIMESTAMP',
  })
  identFecHorAnula: Date;

  @Column('varchar2', { name: 'MOTIV_TIP_DOC_SOLICITA', length: 2 })
  motivTipDocSolicita: string;

  @Column('varchar2', { name: 'DOCUM_NUMERO_CONTROL', length: 31 })
  documNumeroControl: string;

  @Column('varchar2', {
    name: 'EMISO_COD_PUNTO_VENTA',
    nullable: true,
    length: 15,
  })
  emisoCodPuntoVenta: string | null;

  @Column('varchar2', { name: 'DOCUM_CODIGO_GENERACION', length: 36 })
  documCodigoGeneracion: string;

  @Column('varchar2', {
    name: 'IDENT_AMBIENTE',
    length: 2,
    default: () => "'01'",
  })
  identAmbiente: string;

  @Column('varchar2', {
    name: 'EMISO_COD_ESTABLE_MH',
    nullable: true,
    length: 4,
  })
  emisoCodEstableMh: string | null;

  @Column('varchar2', { name: 'DOCUM_TIPO_DOCUMENTO', length: 2 })
  documTipoDocumento: string;

  @Column('number', { name: 'MOTIV_TIPO_ANULACION', precision: 1, scale: 0 })
  motivTipoAnulacion: number;

  @Column('varchar2', {
    name: 'EMISO_COD_PUNTO_VENTA_MH',
    nullable: true,
    length: 4,
  })
  emisoCodPuntoVentaMh: string | null;

  @Column('varchar2', { name: 'MOTIV_TIP_DOC_RESPONSABLE', length: 2 })
  motivTipDocResponsable: string;

  @Column('varchar2', { name: 'EMISO_CORREO', length: 100 })
  emisoCorreo: string;

  @Column('varchar2', { name: 'MOTIV_NOMBRE_RESPONSABLE', length: 100 })
  motivNombreResponsable: string;

  @Column('varchar2', { name: 'DOCUM_TIPO_DTE', length: 2 })
  documTipoDte: string;

  @Column('varchar2', { name: 'IDENT_CODIGO_GENERACION', length: 36 })
  identCodigoGeneracion: string;

  @Column('number', {
    name: 'DOCUM_MONTO_IVA',
    nullable: true,
    precision: 12,
    scale: 2,
  })
  documMontoIva: number | null;

  @Column('varchar2', { name: 'DOCUM_SELLO_RECIBIDO', length: 40 })
  documSelloRecibido: string;

  @Column('varchar2', {
    name: 'EMISO_NIT',
    nullable: true,
    length: 14,
    default: () => 'NULL',
  })
  emisoNit: string | null;

  @Column('date', {
    name: 'FECHA_CREA',
    nullable: true,
    default: () => 'CURRENT_DATE',
  })
  fechaCrea: Date | null;

  @Column('varchar2', { name: 'DOCUM_TELEFONO', nullable: true, length: 50 })
  documTelefono: string | null;

  @Column('number', {
    name: 'IDENT_VERSION',
    precision: 1,
    scale: 0,
    default: () => '2',
  })
  identVersion: number;

  @Column('date', { name: 'FECHA_MODI', nullable: true })
  fechaModi: Date | null;

  @Column('varchar2', { name: 'EMISO_COD_ESTABLE', nullable: true, length: 10 })
  emisoCodEstable: string | null;

  @PrimaryGeneratedColumn({
    type: 'number',
    name: 'ID',
  })
  id: number;

  @Column('varchar2', { name: 'ESTADO', nullable: true, length: 3 })
  estado: string | null;

  @Column('varchar2', { name: 'MOTIV_NOMBRE_SOLICITA', length: 100 })
  motivNombreSolicita: string;

  @Column('varchar2', { name: 'USER_MODI', nullable: true, length: 30 })
  userModi: string | null;

  @Column('varchar2', { name: 'USER_CREA', nullable: true, length: 30 })
  userCrea: string | null;

  @Column('varchar2', {
    name: 'MOTIV_MOTIVO_ANULACION',
    nullable: true,
    length: 250,
  })
  motivMotivoAnulacion: string | null;

  @Column('varchar2', { name: 'MOTIV_NUM_DOC_RESPONSABLE', length: 20 })
  motivNumDocResponsable: string;

  @Column('varchar2', { name: 'EMISO_TIPO_ESTABLECIMIENTO', length: 2 })
  emisoTipoEstablecimiento: string;

  @Column('varchar2', { name: 'DOCUM_NUM_DOCUMENTO', length: 20 })
  documNumDocumento: string;

  @Column('varchar2', { name: 'DOCUM_CORREO', nullable: true, length: 100 })
  documCorreo: string | null;

  @Column('varchar2', {
    name: 'EMISO_TELEFONO',
    nullable: true,
    length: 26,
    default: () => 'NULL',
  })
  emisoTelefono: string | null;

  @Column('varchar2', {
    name: 'DOCUM_CODIGO_GENERACION_R',
    nullable: true,
    length: 36,
  })
  documCodigoGeneracionR: string | null;

  @Column('varchar2', {
    name: 'EMISO_NOMBRE',
    nullable: true,
    length: 150,
    default: () => 'NULL',
  })
  emisoNombre: string | null;

  @Column('date', { name: 'DOCUM_FEC_EMI' })
  documFecEmi: Date;

  @Column('varchar2', { name: 'MOTIV_NUM_DOC_SOLICITA', length: 20 })
  motivNumDocSolicita: string;
}
