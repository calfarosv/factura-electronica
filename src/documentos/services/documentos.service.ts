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


  getPup_08(): string {
    this.example_puppeteer_08();
    return 'Puppeteer 08';
  }



  public async example_puppeteer_08(): Promise<void> {
    const serverUrl = this.appContextService.getServerUrl();
    console.log('URL: ' + serverUrl);
    const puppeteer = require('puppeteer');
    const fs = require('fs-extra');
    const hbs = require('handlebars');
    const path = require('path');
    const nombre_json = 'documento_cel.json';
    const qr = require('qrcode');
    // Ruta del archivo JSON
    const fileJsonDocumento = join(__dirname, '..', '..', 'public', nombre_json);
    // Fecha y hora actual
    const moment_hora = require('moment');
    let currentDate = moment_hora().format('DD/MM/YYYY');
    let currentTime = moment_hora().format('hh:mm:ss');
    const Fecha_hora = currentDate + '   ' + currentTime;

    // Leer el archivo JSON
    const jsonData = fs.readFileSync(fileJsonDocumento, 'utf-8');
    const data = JSON.parse(jsonData);

    // Registra el helper personalizado en Handlebars
    // Se establece  minimumFractionDigits y maximumFractionDigits en 2
    // para mostrar exactamente 2 decimales. 
    hbs.registerHelper('formatNumber_Moneda', function (number) {
      // Aplica el formato de número deseado
      const formattedNumber = number.toLocaleString('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
      return formattedNumber;
    });

    hbs.registerHelper('formatNumber', function(number) {
      // Aplica el formato de número deseado
      const formattedNumber = number.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
      return formattedNumber;
    });


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


    //---- DATOS PARA TIPO DTE 01
    const v_01_nombre_doc = 'FACTURA';
    const v_01_version_doc = 'Ver 1.0';
    const v_01_receptor = `
      <p class="tamanio_04"><b>${rec_NOM}</b><br>
          Tipo de Doc. de Ide.: <b>${rec_TDO}</b><br>
          NRC: <b>${rec_NRC}</b><br>
          ACTIVIDAD: <b>${rec_NDO}</b><br>
          Correo electrónico: <b>${rec_COR}</b><br>
          Establecimiento: <b>${rec_EST}</b><br>
      </p>`;
    //---- DATOS PARA TIPO DTE 03
    const v_03_nombre_doc = 'COMPROBANTE DE CRÉDITO FISCAL';
    const v_03_version_doc = 'Ver 3.0';
    const v_03_receptor = `
      <p class="tamanio_04"><b>${rec_NOM}</b><br>
          NIT: <b>${rec_NIT}</b><br>
          NRC: <b>${rec_NRC}</b><br>
          ACTIVIDAD: <b>${rec_DES}</b><br>
          <b>${rec_DIR}</b><br>
          TEL: <b>${rec_TEL}</b><br>
          Correo electrónico: <b>${rec_COR}</b><br>
          Establecimiento: <b>${rec_EST}</b><br>
      </p>`;

    let v_nombre_doc = '';
    let v_version = '';
    let v_receptor = '';
    let nombre_archivo = '';

    if (ide_TDT == '01') {
      v_nombre_doc = v_01_nombre_doc;
      v_version = v_01_version_doc;
      v_receptor = v_01_receptor;
      // Definiendo nombre del archivo PDF
      nombre_archivo = `${emi_NIT}_${rec_NDO}_${ide_CGE}`;
    } else if (ide_TDT == '03') {
      v_nombre_doc = v_03_nombre_doc;
      v_version = v_03_version_doc;
      v_receptor = v_03_receptor;
      nombre_archivo = `${emi_NIT}_${rec_NIT}_${ide_CGE}`;
    }


    //const fileName = `${identificacion}_${emisor}_${receptor}.pdf`;
    const filePdfDocumento = join(__dirname, '..', '..', 'public', `${nombre_archivo}.pdf`);
    //Codigo QR
    const fileQr = join(__dirname, '..', '..', 'public', `${nombre_archivo}.png`);
    //url: `${serverUrl}/static/`,

    const compile = async function (templateName, datos) {
      const filePath = path.join(process.cwd(), 'templates', `${templateName}.hbs`);
      const html = await fs.readFile(filePath, 'utf-8');
      //console.log(html);
      return hbs.compile(html)(datos);
    };

    // Datos del archivo JSON    
    const datosJson = require(join(__dirname, '..', '..', 'public', nombre_json));

    const fileJsonDocumentoNew = join(__dirname, '..', '..', 'public', `${nombre_archivo}` + '.json');
    fs.writeFileSync(fileJsonDocumentoNew, jsonData, 'utf8');

    async function generaPdf(ideTDT: any, v_nombre_doc: any, v_version: any, v_receptor: any) {
      try {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();


        // Variables fijas
        const fixedVariables = {
          nombre_doc: v_nombre_doc,
          version: v_version,
          receptor: v_receptor,
          codigo_qr: `${nombre_archivo}.png`,
          url: `${serverUrl}/static/`
        };
        // Combinar los datos del archivo JSON con las variables fijas
        const fixedPlusJson = { ...datosJson, ...fixedVariables };


        //console.log(datosJson);
        const content = await compile('cel_ccf', fixedPlusJson);

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

    await generaQr();
    console.log('QR generado');
    await generaPdf(ide_TDT, v_nombre_doc, v_version, v_receptor);
    console.log('PDF generado');
    await this.envioCorreo(ide_CGE, ide_NCO, rec_NOM, fileJsonDocumentoNew, filePdfDocumento, fileQr);
    console.log('Correlo Electrónico Enviado');
    console.log('Proceso Finalizado');

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
        //template: 'factura_03',
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
