import { MailerService } from '@nestjs-modules/mailer';
import { ExecutionContext, Injectable } from '@nestjs/common';
import { AppContextService } from './app.context.service';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { join } from 'path';
import * as fs from 'fs';
import { DteEmisor } from '../entities';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { string } from 'joi';
import puppeteer from 'puppeteer';


@Injectable()
export class DocumentosService {
  constructor(
    private readonly mailerService: MailerService,
    private readonly appContextService: AppContextService,
    private readonly httpService: HttpService,
    @InjectRepository(DteEmisor)
    private readonly emisorRepository: Repository<DteEmisor>,
  ) { }


   genera_documento() {
    let jsonDte;
    jsonDte = {
      identificacion: {
          version: 3,
          ambiente: "00",
          tipoDte: "05",
          numeroControl: "DTE-05-00000000-000000000000001",
          codigoGeneracion: "03754C2B-E0C4-3A11-E064-00144FFB12D3",
          tipoModelo: 1,
          tipoOperacion: 1,
          tipoContingencia: null,
          motivoContin: null,
          fecEmi: "2023-08-21",
          horEmi: "16:01:32",
          tipoMoneda: "USD"
      },
      emisor: {
          nit: "06141809480014",
          nrc: "81981",
          nombre: "COMISIÓN EJECUTIVA HIDROELÉCTRICA DEL RÍO LEMPA",
          codActividad: "35101",
          descActividad: "Generación de energía eléctrica",
          nombreComercial: "COMISIÓN EJECUTIVA HIDROELÉCTRICA DEL RÍO LEMPA",
          tipoEstablecimiento: "02",
          telefono: "22116000",
          correo: "info@cel.gob.sv",
          direccion: {
              departamento: "06",
              municipio: "14",
              complemento: "9° CALLE PONIENTE 17° AV. NORTE, CENTRO DE GOBIERNO, # 950, SAN SALVADOR, EL SALVADOR"
          }
      },
      receptor: {
          nit: "06142101230059",
          nrc: "328049",
          nombre: "ADMINISTRACION NACIONAL DE ACUEDUCTOS Y ALCANTARILLADOS",
          codActividad: "36000",
          descActividad: "Captación, tratamiento y suministro de agua",
          nombreComercial: "A.N.D.A.",
          telefono: "2225-8377",
          correo: null,
          direccion: {
              departamento: "06",
              municipio: "14",
              complemento: "COL. LIBERTAD, AV. DON BOSCO, EDIFICIO ANDA"
          }
      },
      documentoRelacionado: [
          {
              tipoDocumento: "03",
              tipoGeneracion: 1,
              numeroDocumento: "55",
              fechaEmision: "2023-02-28"
          }
      ],
      extension: null,
      ventaTercero: null,
      resumen: {
          totalNoSuj: 0,
          totalExenta: 0,
          totalGravada: 9542617.57,
          subTotalVentas: 9542617.57,
          descuNoSuj: 0,
          descuExenta: 0,
          descuGravada: 0,
          totalDescu: 0,
          subTotal: 9542617.57,
          ivaPerci1: 0,
          ivaRete1: 0,
          reteRenta: 0,
          montoTotalOperacion: 10783157.86,
          totalLetras: "DIEZ MILLONES SETECIENTOS OCHENTA Y TRES MIL CIENTO CINCUENTA Y SIETE  DÓLARES CON 86/100",
          condicionOperacion: 1,
          tributos: [
              {
                  codigo: "20",
                  descripcion: "Impuesto al Valor Agregado 13%",
                  valor: 1240540.29
              }
          ]
      },
      cuerpoDocumento: [
          {
              numItem: 1,
              tipoItem: 3,
              numeroDocumento: "55",
              codigo: null,
              codTributo: null,
              descripcion: "AJUSTE A FACTURACION POR SUMINISTRO DE  109,131.221058 MWH, PERIODO COMP. MAR/21 HASTA PARCIAL SEP/21, APLICADO AL CCF 55 DE FECHA 28/02/2023.",
              cantidad: 1,
              uniMedida: 59,
              precioUni: 9542617.57,
              montoDescu: 0,
              ventaNoSuj: 0,
              ventaExenta: 0,
              ventaGravada: 9542617.57,
              tributos: [
                  20
              ]
          }
      ],
      apendice: null
  }


  
this.genera_documento_cel(jsonDte);
return 'Proceso Finalizado';
  }


  public async genera_documento_cel(dte: any): Promise < void> {
  const serverUrl = this.appContextService.getServerUrl();
  console.log('URL: ' + serverUrl);
  const puppeteer = require('puppeteer');
  const fs = require('fs-extra');
  const hbs = require('handlebars');
  const path = require('path');
  const qr = require('qrcode');
  const { format } = require('date-fns');

  //ARCHIVO JSON////////////////////////////////
  //const nombre_json = 'documento_cel_05.json';
  //////////////////////////////////////////////

  // Ruta del archivo JSON
  //const fileJsonDocumento = join(__dirname, '..', '..', 'public', nombre_json);
  // Leer el archivo JSON
  //const jsonData = fs.readFileSync(fileJsonDocumento, 'utf-8');
  //const data = JSON.parse(jsonData);
  const data = dte;

  // Fecha y hora actual
  const moment_hora = require('moment');
  let currentDate = moment_hora().format('DD/MM/YYYY');
  let currentTime = moment_hora().format('hh:mm:ss');
  const Fecha_hora = currentDate + '   ' + currentTime;

  // FORMATO MONEDA UTILIZADO DENTRO DE LA PLANTILLA HBS
  // Se establece  minimumFractionDigits y maximumFractionDigits en 2 para mostrar exactamente 2 decimales. 
  hbs.registerHelper('formatNumber_Moneda', function (number) {
    // Aplica el formato de número deseado
    const formattedNumber = number !== null ? number.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }) : '';
    return formattedNumber;
  });

  // FORMATO NÚMERO UTILIZADO DENTRO DE LA PLANTILLA HBS
  // Se establece  minimumFractionDigits y maximumFractionDigits en 2 para mostrar exactamente 2 decimales. 
  hbs.registerHelper('formatNumber_Cantidad', function (number) {
    // Aplica el formato de número deseado
    const formattedNumber = number !== null ? number.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }) : '';
    return formattedNumber;
  });

  //VALIDA SI LA VARIABLE DEL JSON EXISTE O NO
  hbs.registerHelper('isDefined', function (value) {
    return value !== undefined;
  });

  hbs.registerHelper('formatDate', function (date) {
    const fechaObjeto = new Date(date);
    const dia = fechaObjeto.getDate().toString().padStart(2, '0');
    const mes = (fechaObjeto.getMonth() + 1).toString().padStart(2, '0');
    const anio = fechaObjeto.getFullYear().toString();

    const fechaFormateada = `${dia}/${mes}/${anio}`;
    return fechaFormateada;
  });

  hbs.registerHelper('isEqual', function(value1, value2, options) {
    if (value1 === value2) {
      return options.fn(this);
    } else {
      return options.inverse(this);
    }
  });

  // FORMATO MONEDA UTILIZADO EN EL SERVICIO
  function formatCurrency(amount, locale, currency, decimalDigits) {
  if (amount === null || amount === undefined) {
    return ''; // Devuelve una cadena vacía si el valor es nulo o indefinido
  }

  return amount.toLocaleString(locale, {
    style: 'currency',
    currency: currency,
    currencyDisplay: 'symbol',
    minimumFractionDigits: decimalDigits,
    maximumFractionDigits: decimalDigits
  });
}

function formatearFecha_01(fecha) {
  const fechaObjeto = new Date(fecha);
  const dia = fechaObjeto.getDate().toString().padStart(2, '0');
  const mes = (fechaObjeto.getMonth() + 1).toString().padStart(2, '0');
  const anio = fechaObjeto.getFullYear().toString();
  const horas = fechaObjeto.getHours().toString().padStart(2, '0');
  const minutos = fechaObjeto.getMinutes().toString().padStart(2, '0');
  const segundos = fechaObjeto.getSeconds().toString().padStart(2, '0');

  const fechaFormateada = `${dia}/${mes}/${anio} ${horas}:${minutos}:${segundos}`;
  return fechaFormateada;
}

function formatearFecha_02(fecha) {
  const fechaObjeto = new Date(fecha);
  const dia = fechaObjeto.getDate().toString().padStart(2, '0');
  const mes = (fechaObjeto.getMonth() + 1).toString().padStart(2, '0');
  const anio = fechaObjeto.getFullYear().toString();

  const fechaFormateada = `${dia}/${mes}/${anio}`;
  return fechaFormateada;
}

// Obtener los valores necesarios del archivo JSON
const ide_TDT = data.identificacion.tipoDte;
const ide_CGE = data.identificacion.codigoGeneracion;
const ide_NCO = data.identificacion.numeroControl;
const ide_FEC = data.identificacion.fecEmi;
const emi_NIT = data.emisor.nit;
const rec_NIT = data.receptor.nit;
const rec_NOM = data.receptor.nombre;
const rec_NRC = data.receptor.nrc;
const rec_DES = data.receptor.descActividad;
const rec_DIR = data.receptor.direccion.complemento;
const rec_TEL = data.receptor.telefono;
const rec_COR = data.receptor.correo;
const rec_EST = data.receptor.nombreComercial;
const rec_TDO = data.receptor.tipoDocumento;
const rec_NDO = data.receptor.numDocumento;
const res_IVP = formatCurrency(data.resumen.ivaPerci1, 'en-US', 'USD', 2);
const res_TNG = formatCurrency(data.resumen.totalNoGravado, 'en-US', 'USD', 2);
const res_TPA = formatCurrency(data.resumen.totalPagar, 'en-US', 'USD', 2);
const ven_TER = data.ventaTercero !== undefined && data.ventaTercero !== null && data.ventaTercero.length > 0 ? data.ventaTercero : null;
const doc_REL = data.documentoRelacionado !== undefined && data.documentoRelacionado !== null && data.documentoRelacionado.length > 0 ? data.documentoRelacionado : null;
const otr_DOC = data.otrosDocumentos !== undefined && data.otrosDocumentos !== null && data.otrosDocumentos.length > 0 ? data.otrosDocumentos : null;
const apendi = data.apendice !== undefined && data.apendice !== null && data.apendice.length > 0 ? data.apendice : null;
const extens = data.extension !== undefined && data.extension !== null && data.extension.length > 0 ? data.extension : null;
const nuloReemplazar = ``;
let dre_TDO = ``;
let dre_TGE = ``;
let dre_NDO = ``;
let dre_FEE = ``;
let v_plantilla = ``;

if (doc_REL !== null && doc_REL !== undefined) {
  dre_TDO = data.documentoRelacionado[0].tipoDocumento || null;
  dre_TGE = data.documentoRelacionado[0].tipoGeneracion || null;
  dre_NDO = data.documentoRelacionado[0].numeroDocumento || null;
  dre_FEE = data.documentoRelacionado[0].fechaEmision || null;
  if (dre_FEE) {
    const fechaFormateada = formatearFecha_02(dre_FEE);
    dre_FEE = fechaFormateada;
  }
}

/*
    console.log('ven_TER: ' + ven_TER);
    console.log('doc_REL: ' + doc_REL);
    console.log('otr_DOC: ' + otr_DOC);
    console.log('dre_TDO: ' + dre_TDO);
    console.log('dre_TGE: ' + dre_TGE);
    console.log('dre_NDO: ' + dre_NDO);
    console.log('dre_FEE: ' + dre_FEE);
*/
/////////////////////////////////////////////////
//---- DATOS PARA TIPO DTE 01 - FACTURA
/////////////////////////////////////////////////
const v_01_noGravadoEtiqueta =
  `<td class="col7" style="text-align: center;">
              <p class="tamanio_05"><b>Otros Montos no afectados</b></p>
           </td>`;
const v_01_noGravadoHtml01 = `<td style="text-align: right;"><p class="tamanio_05">`;
const v_01_noGravadoHtml02 = `</p></td>`;
const v_01_ivaPercibido = ``;
const v_01_totalNoGravado = ` 
      <tr>
        <td class="colxxx1" align="right">
            <p class="tamanio_04"><b>Total Otros montos no afectados:</b></p>
        </td>
        <td class="colxxx2" style="text-align: right; padding-right: 0.5em;">
            <p class="tamanio_04">${res_TNG}</p>
        </td>
      </tr>`;
const v_01_totalPagar = `
      <tr>
        <td class="colxxx1" align="right">
            <p class="tamanio_04"><b>Total a Pagar:</b></p>
        </td>
        <td class="colxxx2" style="text-align: right; padding-right: 0.5em;">
            <p class="tamanio_04">${res_TPA}</p>
        </td>
      </tr>`;
const v_01_descTot1 = `Sumatoria de Ventas:`;
const V_01_porc_descripcion = `width: 31%;`;

//////////////////////////////////////////////////////////////
//---- DATOS PARA TIPO DTE 03 - COMPROBANTE DE CRÉDITO FISCAL
//////////////////////////////////////////////////////////////
const v_03_noGravadoEtiqueta =
  `<td class="col7" style="text-align: center;">
          <p class="tamanio_05"><b>Otros Montos no afectados</b></p>
       </td>`;
const v_03_noGravadoHtml01 = `<td style="text-align: right;"><p class="tamanio_05">`;
const v_03_noGravadoHtml02 = `</p></td>`;
const v_03_ivaPercibido = `
      <tr>
        <td class="colxxx1" align="right">
            <p class="tamanio_04"><b>IVA Percibido:</b></p>
        </td>
        <td class="colxxx2" style="text-align: right; padding-right: 0.5em;">
        <p class="tamanio_04">${res_IVP}</p>
        </td>
      </tr>`;
const v_03_totalNoGravado = ` 
      <tr>
        <td class="colxxx1" align="right">
            <p class="tamanio_04"><b>Total Otros montos no afectados:</b></p>
        </td>
        <td class="colxxx2" style="text-align: right; padding-right: 0.5em;">
            <p class="tamanio_04">${res_TNG}</p>
        </td>
      </tr>`;
const v_03_totalPagar = `
      <tr>
        <td class="colxxx1" align="right">
            <p class="tamanio_04"><b>Total a Pagar:</b></p>
        </td>
        <td class="colxxx2" style="text-align: right; padding-right: 0.5em;">
            <p class="tamanio_04">${res_TPA}</p>
        </td>
      </tr>`;
const v_03_descTot1 = `Suma Total de Operaciones`;
const V_03_porc_descripcion = `width: 31%;`;



/////////////////////////////////////////////////
//---- DATOS PARA TIPO DTE 05 - NOTA DE CRÉDITO
/////////////////////////////////////////////////
const v_05_noGravadoEtiqueta = ``;
const v_05_noGravadoHtml01 = ``;
const v_05_noGravadoHtml02 = ``;
const v_05_ivaPercibido = `
      <tr>
        <td class="colxxx1" align="right">
            <p class="tamanio_04"><b>IVA Percibido:</b></p>
        </td>
        <td class="colxxx2" style="text-align: right; padding-right: 0.5em;">
        <p class="tamanio_04">${res_IVP}</p>
        </td>
      </tr>`;
const v_05_totalNoGravado = ``;
const v_05_totalPagar = ``;
const v_05_descTot1 = `Suma Total de Operaciones`;
const V_05_porc_descripcion = `width: 31%;`;

/////////////////////////////////////////////////
//---- DATOS PARA TIPO DTE 06 - NOTA DE DÉBITO
/////////////////////////////////////////////////
const v_06_noGravadoEtiqueta = ``;
const v_06_noGravadoHtml01 = ``;
const v_06_noGravadoHtml02 = ``;
const v_06_ivaPercibido = `
      <tr>
        <td class="colxxx1" align="right">
            <p class="tamanio_04"><b>IVA Percibido:</b></p>
        </td>
        <td class="colxxx2" style="text-align: right; padding-right: 0.5em;">
        <p class="tamanio_04">${res_IVP}</p>
        </td>
      </tr>`;
const v_06_totalNoGravado = ``;
const v_06_totalPagar = ``;
const v_06_descTot1 = `Suma Total de Operaciones`;
const V_06_porc_descripcion = `width: 31%;`;

/////////////////////////////////////////////////////////
//---- DATOS PARA TIPO DTE 07 - COMPROBANTE DE RETENCIÓN
/////////////////////////////////////////////////////////
const v_07_noGravadoEtiqueta = ``;
const v_07_noGravadoHtml01 = ``;
const v_07_noGravadoHtml02 = ``;
const v_07_ivaPercibido = `
      <tr>
        <td class="colxxx1" align="right">
            <p class="tamanio_04"><b>IVA Percibido:</b></p>
        </td>
        <td class="colxxx2" style="text-align: right; padding-right: 0.5em;">
        <p class="tamanio_04">${res_IVP}</p>
        </td>
      </tr>`;
const v_07_totalNoGravado = ``;
const v_07_totalPagar = ``;
const v_07_descTot1 = `Suma Total de Operaciones`;
const V_07_porc_descripcion = `width: 31%;`;


let v_noGravadoEtiqueta = ``;
let v_noGravadoHtml01 = ``;
let v_noGravadoHtml02 = ``;
let v_ivaPercibido = '';
let v_totalNoGravado = '';
let v_totalPagar = '';
let v_descTot01 = '';
let v_porc_descripcion = '';
let nombre_archivo = '';

/////////////////////////////////////////////////
//---- PLANTILLA - TIPO 01
/////////////////////////////////////////////////
if (ide_TDT == '01') {
  v_plantilla = 'cel_documento_01';
  v_noGravadoEtiqueta = v_01_noGravadoEtiqueta;
  v_noGravadoHtml01 = v_01_noGravadoHtml01;
  v_noGravadoHtml02 = v_01_noGravadoHtml02;
  v_ivaPercibido = v_01_ivaPercibido;
  v_totalNoGravado = v_01_totalNoGravado;
  v_totalPagar = v_01_totalPagar;
  v_descTot01 = v_01_descTot1;
  v_porc_descripcion = V_01_porc_descripcion;
  nombre_archivo = `${emi_NIT}_${rec_NDO}_${ide_CGE}`; // Definiendo nombre del archivo PDF
  hbs.registerPartial('columnaNoGravado01', v_01_noGravadoHtml01); // PARTIALS PARA PLANTILLA - TIPO 01
  hbs.registerPartial('columnaNoGravado02', v_01_noGravadoHtml02); // PARTIALS PARA PLANTILLA - TIPO 01
}

/////////////////////////////////////////////////
//---- PLANTILLA - TIPO 03
/////////////////////////////////////////////////
else if (ide_TDT == '03') {
  v_plantilla = 'cel_documento_01';
  v_noGravadoEtiqueta = v_03_noGravadoEtiqueta;
  v_noGravadoHtml01 = v_03_noGravadoHtml01;
  v_noGravadoHtml02 = v_03_noGravadoHtml02;
  v_ivaPercibido = v_03_ivaPercibido;
  v_totalNoGravado = v_03_totalNoGravado;
  v_totalPagar = v_03_totalPagar;
  v_descTot01 = v_03_descTot1;
  v_porc_descripcion = V_03_porc_descripcion;
  nombre_archivo = `${emi_NIT}_${rec_NIT}_${ide_CGE}`; // Definiendo nombre del archivo PDF
  hbs.registerPartial('columnaNoGravado01', v_03_noGravadoHtml01); //PARTIALS PARA PLANTILLA - TIPO 03
  hbs.registerPartial('columnaNoGravado02', v_03_noGravadoHtml02); //PARTIALS PARA PLANTILLA - TIPO 03
}



/////////////////////////////////////////////////
//---- PLANTILLA - TIPO 05
/////////////////////////////////////////////////
else if (ide_TDT == '05') {
  v_plantilla = 'cel_documento_01';
  v_noGravadoEtiqueta = v_05_noGravadoEtiqueta;
  v_noGravadoHtml01 = v_05_noGravadoHtml01;
  v_noGravadoHtml02 = v_05_noGravadoHtml02;
  v_ivaPercibido = v_05_ivaPercibido;
  v_totalNoGravado = v_05_totalNoGravado;
  v_totalPagar = v_05_totalPagar;
  v_descTot01 = v_05_descTot1;
  v_porc_descripcion = V_05_porc_descripcion;
  nombre_archivo = `${emi_NIT}_${rec_NIT}_${ide_CGE}`; // Definiendo nombre del archivo PDF
  hbs.registerPartial('columnaNoGravado01', v_05_noGravadoHtml01); //PARTIALS PARA PLANTILLA - TIPO 05
  hbs.registerPartial('columnaNoGravado02', v_05_noGravadoHtml02); //PARTIALS PARA PLANTILLA - TIPO 05
}


/////////////////////////////////////////////////
//---- PLANTILLA - TIPO 06
/////////////////////////////////////////////////
else if (ide_TDT == '06') {
  v_plantilla = 'cel_documento_01';
  v_noGravadoEtiqueta = v_06_noGravadoEtiqueta;
  v_noGravadoHtml01 = v_06_noGravadoHtml01;
  v_noGravadoHtml02 = v_06_noGravadoHtml02;
  v_ivaPercibido = v_06_ivaPercibido;
  v_totalNoGravado = v_06_totalNoGravado;
  v_totalPagar = v_06_totalPagar;
  v_descTot01 = v_06_descTot1;
  v_porc_descripcion = V_06_porc_descripcion;
  nombre_archivo = `${emi_NIT}_${rec_NIT}_${ide_CGE}`; // Definiendo nombre del archivo PDF
  hbs.registerPartial('columnaNoGravado01', v_06_noGravadoHtml01); //PARTIALS PARA PLANTILLA - TIPO 06
  hbs.registerPartial('columnaNoGravado02', v_06_noGravadoHtml02); //PARTIALS PARA PLANTILLA - TIPO 06
}

///////////////////////////////////////////////////////////
//---- DEFINO PARTIALS PARA PLANTILLA PARA TODOS LOS TIPOS
///////////////////////////////////////////////////////////
hbs.registerPartial('tributosHtml01', `<tr>
    <td class="colxxx1" align="right">
        <p class="tamanio_04"><b>`);
hbs.registerPartial('tributosHtml02', `</b></p>
    </td>
    <td class="colxxx2" style="text-align: right; padding-right: 0.5em;">
        <p class="tamanio_04">`);
hbs.registerPartial('tributosHtml03', `</p>
    </td>
</tr>`);

//DEFINO NOMBRE DEL ARCHIVO PDF
const filePdfDocumento = join(__dirname, '..', '..', 'public', `${nombre_archivo}.pdf`);
//DEFINO NOMBRE DEL ARCHIVO (PNG) CON CÓDIGO QR
const fileQr = join(__dirname, '..', '..', 'public', `${nombre_archivo}.png`);
//FUNCIÓN QUE COMPILA LA PLANTILLA HBS
const compile = async function (templateName, datos) {
  const filePath = path.join(process.cwd(), 'templates', `${templateName}.hbs`);
  const html = await fs.readFile(filePath, 'utf-8');
  return hbs.compile(html)(datos);
};

// Datos del archivo JSON    
//const datosJson = require(join(__dirname, '..', '..', 'public', nombre_json));
// ARCHIVO PDF QUE SE ENVIARÁ POR CORREO ELECTRÓNICO

const jsonString = JSON.stringify(dte, null, 2);
const fileJsonDocumentoNew = join(__dirname, '..', '..', 'public', `${nombre_archivo}` + '.json');
fs.writeFileSync(fileJsonDocumentoNew, jsonString, 'utf8');

//////////////////////////////////////
await generaQr();
console.log('QR generado');
//////////////////////////////////////
await generaPdf(ide_TDT, v_ivaPercibido, v_descTot01, v_porc_descripcion, v_noGravadoEtiqueta, v_noGravadoHtml01, v_noGravadoHtml02, v_plantilla);
console.log('PDF generado');
//////////////////////////////////////
await this.envioCorreo(ide_CGE, ide_NCO, rec_NOM, fileJsonDocumentoNew, filePdfDocumento, fileQr);
console.log('Correlo Electrónico Enviado');
//////////////////////////////////////
console.log('Proceso Finalizado');
//////////////////////////////////////


//////////////////////////////////////
// FUNCIÓN PARA GENERAR ARCHIVO PDF //
//////////////////////////////////////
async function generaPdf(ideTDT: any, 
  v_ivaPercibido: any, v_descTot01: any,
  v_porc_descripcion: any, v_noGravadoEtiqueta: any, v_noGravadoHtml01: any,
  v_noGravadoHtml02: any, 
  v_plantilla: any) {
  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();


    // Variables fijas
    const fixedVariables = {
      noGravadoEtiqueta: v_noGravadoEtiqueta,
      noGravadoHtml01: v_noGravadoHtml01,
      noGravadoHtml02: v_noGravadoHtml02,
      ivaPercibido: v_ivaPercibido,
      totalNoGravado: v_totalNoGravado,
      totalPagar: v_totalPagar,
      descTot01: v_descTot01,
      porc_descripcion: v_porc_descripcion,
      codigo_qr: `${nombre_archivo}.png`,
      url: `${serverUrl}/static/`,
    };
    // Combinar los datos del archivo JSON con las variables fijas
    const fixedPlusJson = { ...dte, ...fixedVariables };


    //console.log(datosJson);
    const content = await compile(v_plantilla, fixedPlusJson);

    // Definir el contenido del encabezado y el pie de página como plantillas HTML
    const v_headerTemplate = ``;

    const v_footerTemplate =
      `
            <table width="100%" border="0">
              <tbody>
                <tr>
                  <td style="width: 50%; text-align: left; padding-left: 0.5em; font-size: small; font-family: 'Open Sans', sans-serif; padding-left: 0.5em">
                    <div style="font-size: 7px;">&nbsp;&nbsp;&nbsp;Fecha y hora actual:  `+ `${Fecha_hora}` + `</div>
                  </td>
                  <td style="width: 50%; text-align: right; padding-right: 0.5em; font-size: small; font-family: 'Open Sans', sans-serif; padding-right: 0.5em">
                    <div style="font-size: 7px;">Página <span class="pageNumber"></span> de <span class="totalPages"></span>&nbsp;&nbsp;&nbsp;</div>
                  </td>
                </tr>
              </tbody>
            </table>
          `;


    await page.setContent(content);
    await page.emulateMediaType('screen');
    // Agregar estilos CSS para el encabezado y pie de página
    await page.addStyleTag({
      content: `
            @page {
              size: A4;
              margin-top: 0px;
              margin-bottom: 40px;
            }
          `
    });
    await page.pdf({
      path: filePdfDocumento,
      format: 'A4',
      printBackground: true,
      displayHeaderFooter: true,
      headerTemplate: v_headerTemplate,//`<div style="font-size: 10px">CEL</div>`,
      footerTemplate: v_footerTemplate,//`<div style="font-size: 10px"><span class="pageNumber"></span> / <span class="totalPages"></span></div>`,
    });

    await browser.close();
    //process.exit();
  } catch (e) {
    console.log('our errpr', e);
  }
};

/////////////////////////////////////
// FUNCIÓN PARA GENERAR ARCHIVO QR //
/////////////////////////////////////
async function generaQr() {
  //Codigo QR
  //const urlMh01 = 'https://webapp.dtes.mh.gob.sv/consultaPublica?ambiente=01&codGen=';
  const urlMh01 = 'https://admin.factura.gob.sv/consultaPublica?ambiente=00&codGen=';
  const urlMh02 = ide_CGE;
  const urlMh03 = '&fechaEmi=';
  const urlMh04 = ide_FEC;

  // URL para generar el código QR
  //const url = 'https://www.youtube.com/';
  //const url = 'https://webapp.dtes.mh.gob.sv/consultaPublica?ambiente=01&codGen=28576AF5-EB91-4BB6-9FEE-753D0936ACFF&fechaEmi=2023-08-28';

  const url = urlMh01 + urlMh02 + urlMh03 + urlMh04;

  qr.toFile(fileQr, url, function (err, code) {
    if (err) {
      return console.log('error');

    }
    {
      //console.log(code);
      console.log('Código QR generado correctamente.');
    }

  });
}



  }



  public async envioCorreo(ide_CGE: any, ide_NCO: any, rec_NOM: any, fileJsonDocumentoNew: any, filePdfDocumento: any, fileQr: any): (Promise<void>) {
  const serverUrl = this.appContextService.getServerUrl();

  this.mailerService
    .sendMail({
      //to: ['henavarro@cel.gob.sv'],
      to: ['calfaro@cel.gob.sv'],
      from: 'calfaro@cel.gob.sv',
      subject: 'Factura Electrónica - CEL',
      // text: 'Bienvenido', // plaintext body
      //html: '<h1>Bienvenido</h1>',
      template: 'cel_correo_ccf',
      //template: 'cel_correo_01',
      context: {
        url: `${serverUrl}/static/`,
        name: 'Cesar Alfaro',
        asunto: '',
        codgen: ide_CGE,
        numcon: ide_NCO,
        nomrec: rec_NOM,
        //people: ['Yehuda Katz', 'Alan Johnson', 'Charles Jolley'],
      },
      attachments: [
        {
          path: fileJsonDocumentoNew,
          contentType: 'application/json',
          filename: fileJsonDocumentoNew,
          contentDisposition: 'inline', // attachment
        },
        {
          path: filePdfDocumento,
          contentType: 'application/pdf',
          filename: filePdfDocumento,
          contentDisposition: 'inline', // attachment
        },
        {
          path: fileQr,
          contentType: 'application/png',
          filename: fileQr,
          contentDisposition: 'inline', // attachment
        },
      ],
    }
    )
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    .then(() => { })
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    .catch(() => { });

}


}
