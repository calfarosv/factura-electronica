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

  getElAutor(): string {
    return 'Autor: Cesar Alfaro';
  }


  getPup_01(): string {
    this.example_puppeteer_01();
    return 'Puppeteer 01';
  }

  getPup_02(): string {
    this.example_puppeteer_02();
    return 'Puppeteer 02';
  }

  getPup_03(): string {
    this.example_puppeteer_03();
    return 'Puppeteer 03';
  }

  getPup_04(): string {
    this.example_puppeteer_04();
    return 'Puppeteer 04';
  }

  getPup_05(): string {
    this.example_puppeteer_05();
    return 'Puppeteer 05';
  }

  getPup_06(): string {
    this.example_puppeteer_06();
    return 'Puppeteer 06';
  }

  getPup_07(): string {
    this.example_puppeteer_07();
    return 'Puppeteer 07';
  }

  getPup_08(): string {
    this.example_puppeteer_08();
    return 'Puppeteer 08';
  }

  getPup_09(): string {
    this.example_puppeteer_09();
    return 'Puppeteer 09';
  }

  getHello(): string {
    this.example();
    return 'Hello World!';
  }

  async getEmisor(): Promise<DteEmisor> {
    const emisor = await this.emisorRepository.findOneBy({ id: 1 }).then();
    return emisor;
  }

  public async example(): Promise<void> {
    const tempFilePathPdf = join(__dirname, '..', '..', 'public', 'factura.pdf');
    const serverUrl = this.appContextService.getServerUrl();
    console.log('URL: ' + serverUrl);
    const fs = require("fs"); //puppeter

    console.log(join(__dirname, '..', '..', 'public', 'temporal.json'));
    const response = await firstValueFrom(
      this.httpService.get('https://jsonplaceholder.typicode.com/users/1'),
    );

    (async () => {

      // The location / URL
      const url = "https://jsonplaceholder.typicode.com/users/1";

      // Create the browser
      const browser = await puppeteer.launch({
        headless: true
      });

      // Navigate to the website
      const page = await browser.newPage();
      await page.goto(url, { waitUntil: "load" });


      // Generate the PDF
      //await page.pdf({ path: "page.pdf" });
      await page.pdf({ path: tempFilePathPdf });


      // Close the browser
      await browser.close();

    })();

    //console.log('DATA DE AXIOS:', response.data);
    const jsonString = JSON.stringify(response.data, null, 2);

    const tempFilePath = join(__dirname, '..', '..', 'public', 'temporal.json');

    fs.writeFileSync(tempFilePath, jsonString, 'utf8');

    this.mailerService
      .sendMail({
        //to: ['calfaro@cel.gob.sv', 'romalsi@gmail.com'],
        to: ['calfaro@cel.gob.sv'],
        from: 'calfaro@cel.gob.sv',
        subject: 'Factura / Comprobante de Credito Fiscal - CEL ✔',
        // text: 'Bienvenido', // plaintext body
        //html: '<h1>Bienvenido</h1>',
        template: 'email-order-success',
        //template: 'factura_03',
        context: {
          url: `${serverUrl}/static/`,
          name: 'Cesar Alfaro',
          asunto: '',
          people: ['Yehuda Katz', 'Alan Johnson', 'Charles Jolley'],
        },
        attachments: [
          {
            path: tempFilePath,
            contentType: 'application/json',
            filename: 'factura.json',
            contentDisposition: 'inline', // attachment
          },
          {
            path: tempFilePathPdf,
            contentType: 'application/pdf',
            filename: 'factura.pdf',
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

  public async example_puppeteer_01(): Promise<void> {

    const fs = require("fs");
    const tempFilePathPdf = join(__dirname, '..', '..', 'public', 'factura_01.pdf');

    (async () => {

      // The location / URL
      const url = "http://aqicn.org/city/beijing/";

      // Create the browser
      const browser = await puppeteer.launch({
        headless: true
      });

      // Navigate to the website
      const page = await browser.newPage();
      await page.goto(url, { waitUntil: "load" });


      // Generate the PDF
      //await page.pdf({ path: "page.pdf" });
      await page.pdf({ path: tempFilePathPdf });


      // Close the browser
      await browser.close();

    })();

  }

  public async example_puppeteer_02(): Promise<void> {
    const tempHtml = join(__dirname, '..', '..', 'public', 'invoice.html');
    const tempPdfEjemplo = join(__dirname, '..', '..', 'public', 'factura_XX.pdf');
    const fs = require('fs')
    const path = require('path')
    const utils = require('util')
    const puppeteer = require('puppeteer')
    const hb = require('handlebars')
    const readFile = utils.promisify(fs.readFile)
    async function getTemplateHtml() {
      console.log("Loading template file in memory")
      try {
        const invoicePath = path.resolve(tempHtml);
        return await readFile(invoicePath, 'utf8');
      } catch (err) {
        return Promise.reject("Could not load html template");
      }
    }
    async function generatePdf() {
      let data = {};
      getTemplateHtml().then(async (res) => {
        // Now we have the html code of our template in res object
        // you can check by logging it on console
        // console.log(res)
        console.log("Compiing the template with handlebars")
        const template = hb.compile(res, { strict: true });
        // we have compile our code with handlebars
        const result = template(data);
        // We can use this to add dyamic data to our handlebas template at run time from database or API as per need. you can read the official doc to learn more https://handlebarsjs.com/
        const html = result;
        // we are using headless mode
        const browser = await puppeteer.launch();
        const page = await browser.newPage()
        // We set the page content as the generated html by handlebars
        await page.setContent(html)
        // We use pdf function to generate the pdf in the same folder as this file.
        await page.pdf({ path: tempPdfEjemplo, format: 'A4', printBackground: true })
        await browser.close();
        console.log("PDF Generated")
      }).catch(err => {
        console.error(err)
      });
    }
    generatePdf();

  }

  public async example_puppeteer_03(): Promise<void> {
    const serverUrl = this.appContextService.getServerUrl();
    console.log('URL: ' + serverUrl);
    const url = `${serverUrl}/static/`;
    var fecha = new Date();
    var hora_actual = fecha.getHours();
    const moment_hora = require('moment');

    let currentDate = moment_hora().format('YYYY-MM-DD')
    let currentTime = moment_hora().format('hh-mm-ss')

    const puppeteer = require('puppeteer');
    const fs = require('fs-extra');
    //const data = require('../../../src/database.json');
    const data = join(__dirname, '..', '..', 'public', 'database.json');
    //const tempPdfEjemplo = join(__dirname, '..', '..', 'public', 'factura_cesar.pdf');
    const nombre_archivo = 'cesar_factura' + '_' + currentDate + '_' + currentTime;
    const tempPdfEjemplo = join(__dirname, '..', '..', 'public', `${nombre_archivo}.pdf`);

    //const plantilla = join(__dirname, '..', '..', 'public', 'database.json');
    const hbs = require('handlebars');
    const path = require('path');
    const moment = require('moment');

    const compile = async function (templateName, data) {
      const filePath = path.join(process.cwd(), 'templates', `${templateName}.hbs`);
      const html = await fs.readFile(filePath, 'utf-8');

      console.log(html);

      return hbs.compile(html)(data);
    };

    hbs.registerHelper('dateFormat', function (value, format) {
      //console.log('formatting',value, format);
      return moment(value).format(format);
    });

    (async function () {
      try {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        const content = await compile('factura_02', data);

        await page.setContent(content);
        await page.emulateMediaType('screen');
        await page.pdf({
          path: tempPdfEjemplo,
          format: 'A4',
          printBackground: true,
        });
        await browser.close();
        console.log("PDF Generated")

        //process.exit();
      } catch (e) {
        console.log('our errpr', e);
      }
    })();
  }

  public async example_puppeteer_04(): Promise<void> {
    const moment_hora = require('moment');
    let currentDate = moment_hora().format('YYYY-MM-DD');
    let currentTime = moment_hora().format('hh-mm-ss');
    const nombre_archivo = 'prueba_' + '_' + currentDate + '_' + currentTime;
    const puppeteer = require('puppeteer');
    const fs = require('fs-extra');
    const hbs = require('handlebars');
    const path = require('path');
    const datos = require(join(__dirname, '..', '..', 'public', 'database.json'));
    const tempPdfEjemplo = join(__dirname, '..', '..', 'public', `${nombre_archivo}.pdf`);
    const moment = require('moment');


    const compile = async function (templateName, datos) {
      const filePath = path.join(process.cwd(), 'templates', `${templateName}.hbs`);
      const html = await fs.readFile(filePath, 'utf-8');
      //console.log(html);
      return hbs.compile(html)(datos);
    };

    hbs.registerHelper('dateFormat', function (value, format) {
      console.log('formatting', value, format);
      return moment(value).format(format);
    });

    (async function () {
      try {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();

        console.log(datos);
        const content = await compile('shot-list', datos);

        await page.setContent(content);
        await page.emulateMediaType('screen');
        await page.pdf({
          path: tempPdfEjemplo,
          format: 'A4',
          printBackground: true,
        });

        console.log('done');
        await browser.close();
        process.exit();
      } catch (e) {
        console.log('our errpr', e);
      }
    })();
  }

  public async example_puppeteer_05(): Promise<void> {
    const serverUrl = this.appContextService.getServerUrl();
    console.log('URL: ' + serverUrl);
    const moment_hora = require('moment');
    let currentDate = moment_hora().format('YYYY-MM-DD');
    let currentTime = moment_hora().format('hh-mm-ss');
    const nombre_archivo = 'prueba' + '_' + currentDate + '_' + currentTime;
    const puppeteer = require('puppeteer');
    const fs = require('fs-extra');
    const hbs = require('handlebars');
    const path = require('path');
    const datos = require(join(__dirname, '..', '..', 'public', 'cf_cel.json'));
    const tempPdfEjemplo = join(__dirname, '..', '..', 'public', `${nombre_archivo}.pdf`);
    const moment = require('moment');

    //url: `${serverUrl}/static/`,


    const compile = async function (templateName, datos) {
      const filePath = path.join(process.cwd(), 'templates', `${templateName}.hbs`);
      const html = await fs.readFile(filePath, 'utf-8');
      //console.log(html);
      return hbs.compile(html)(datos);
    };

    hbs.registerHelper('dateFormat', function (value, format) {
      console.log('formatting', value, format);
      return moment(value).format(format);
    });

    (async function () {
      try {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();

        console.log(datos);
        const content = await compile('email-order-success', datos);

        await page.setContent(content);
        await page.emulateMediaType('screen');
        await page.pdf({
          path: tempPdfEjemplo,
          format: 'A4',
          printBackground: true,
        });

        console.log('done');
        await browser.close();
        //process.exit();
      } catch (e) {
        console.log('our errpr', e);
      }
    })();
  }

  public async example_puppeteer_06(): Promise<void> {
    const serverUrl = this.appContextService.getServerUrl();
    console.log('URL: ' + serverUrl);
    //-----------------------------------------------------------------------------------------    
    const puppeteer = require('puppeteer');
    const handlebars = require('handlebars');
    const fs = require('fs');
    const path = require('path');

    // Función para generar el archivo PDF
    async function generatePDF() {
      // Rutas de los archivos y carpetas
      //const imagesFolder = path.join(__dirname, '../../images');
      //const templatePath = path.join(__dirname, '../../templates/factura_03.hbs');
      const templatePath = path.join(process.cwd(), 'templates', 'factura_03.hbs');
      //const outputPath = path.join(__dirname, '../../../dist/public/factura.pdf');
      const outputPath = join(__dirname, '..', '..', 'public', 'hola.pdf');
      //console.log('imagesFolder: ' + imagesFolder);
      console.log('templatePath: ' + templatePath);
      console.log('outputPath: ' + outputPath);
      // Cargar la plantilla HBS desde un archivo
      const template = fs.readFileSync(templatePath, 'utf-8');
      console.log(template);
      // Compilar la plantilla HBS utilizando Handlebars
      const compiledTemplate = handlebars.compile(template);
      console.log(compiledTemplate);
      // Datos de ejemplo para la plantilla HBS
      const templateData = {
        title: 'Factura',
        message: '¡Gracias por su compra!',
        url: `${serverUrl}/static/`,
      };
      console.log('templateData: ' + templateData);
      // Renderizar la plantilla con los datos proporcionados
      const renderedTemplate = compiledTemplate(templateData);
      console.log('renderedTemplate: ' + renderedTemplate);
      // Crear una instancia del navegador Puppeteer
      const browser = await puppeteer.launch();
      const page = await browser.newPage();

      // Establecer el contenido HTML de la página con la plantilla renderizada
      await page.setContent(renderedTemplate);

      // Generar el archivo PDF
      await page.pdf({ path: outputPath, format: 'A4' });

      // Cerrar el navegador Puppeteer
      await browser.close();

      console.log('Archivo PDF generado correctamente.');
    }

    // Llamar a la función para generar el archivo PDF
    generatePDF();

  }


  public async example_puppeteer_07(): Promise<void> {
    const serverUrl = this.appContextService.getServerUrl();
    console.log('URL: ' + serverUrl);
    //-----
    const moment_hora = require('moment');
    let currentDate = moment_hora().format('YYYY-MM-DD');
    let currentTime = moment_hora().format('hh-mm-ss');
    const nombre_archivo = 'Factura' + '_' + currentDate + '_' + currentTime;

    const puppeteer = require('puppeteer');
    const fs = require('fs-extra');
    const hbs = require('handlebars');
    const path = require('path');
    const moment = require('moment');
    const datos = require(join(__dirname, '..', '..', 'public', 'cf_cel.json'));
    //-----
    const fileJsonDocumento = join(__dirname, '..', '..', 'public', 'cf_cel.json');
    const filePdfDocumento = join(__dirname, '..', '..', 'public', `${nombre_archivo}.pdf`);

    console.log(filePdfDocumento);
    //console.log(tempFilePathPdf);

    const compile = async function (templateName, datos) {
      const filePath = path.join(process.cwd(), 'templates', `${templateName}.hbs`);
      const html = await fs.readFile(filePath, 'utf-8');
      //console.log(html);
      return hbs.compile(html)(datos);
    };

    hbs.registerHelper('dateFormat', function (value, format) {
      console.log('formatting', value, format);
      return moment(value).format(format);
    });

    this.mailerService
      .sendMail({
        //to: ['calfaro@cel.gob.sv', 'romalsi@gmail.com'],
        to: ['calfaro@cel.gob.sv'],
        from: 'calfaro@cel.gob.sv',
        subject: 'PRUEBAS Factura Electrónica - CEL',
        // text: 'Bienvenido', // plaintext body
        html: '<h1>Bienvenido</h1>',
        //template: 'email-order-success',
        //template: 'factura_03',
        context: {
          url: `${serverUrl}/static/`,
          name: 'Cesar Alfaro',
          asunto: '',
          people: ['abc', 'def', 'ghi'],
        },
        attachments: [
          {
            path: fileJsonDocumento,
            contentType: 'application/json',
            filename: 'factura.json',
            contentDisposition: 'inline', // attachment
          },
          /*{
            path: filePdfDocumento1,
            contentType: 'application/pdf',
            filename: 'factura.pdf',
            contentDisposition: 'inline', // attachment
          },*/
        ],
      }
      )
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      .then(() => { })
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      .catch(() => { });

  }


  public async example_puppeteer_08(): Promise<void> {
    const serverUrl = this.appContextService.getServerUrl();
    console.log('URL: ' + serverUrl);
    const puppeteer = require('puppeteer');
    const fs = require('fs-extra');
    const hbs = require('handlebars');
    const path = require('path');
    const nombre_json = 'ccf_cel.json';
    const qr = require('qrcode');
    // Ruta del archivo JSON
    const fileJsonDocumento = join(__dirname, '..', '..', 'public', nombre_json);

    // Leer el archivo JSON
    const jsonData = fs.readFileSync(fileJsonDocumento, 'utf-8');
    const data = JSON.parse(jsonData);

    // Obtener los valores necesarios del archivo JSON
    const emiNIT = data.emisor.nit;
    const recNIT = data.receptor.nit;
    const ideCGE = data.identificacion.codigoGeneracion;
    const ideFEC = data.identificacion.fecEmi; 

    // Combinar los valores para obtener el nombre del archivo PDF
    const nombre_archivo = `${emiNIT}_${recNIT}_${ideCGE}`;
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

    const newFileJsonDocumento = join(__dirname, '..', '..', 'public', `${nombre_archivo}` + '.json');
    fs.writeFileSync(newFileJsonDocumento, jsonData, 'utf8');

    (async function () {
      try {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();

        // Variables fijas
        const fixedVariables = {
          //title: 'Factura',
          //message: '¡Gracias por su compra!',
          codigo_qr: `${nombre_archivo}.png`,
          url: `${serverUrl}/static/`,
        };
        // Combinar los datos del archivo JSON con las variables fijas
        const fixedPlusJson = { ...datosJson, ...fixedVariables };


        //console.log(datosJson);
        const content = await compile('email-order-success', fixedPlusJson);

        await page.setContent(content);
        await page.emulateMediaType('screen');
        await page.pdf({
          path: filePdfDocumento,
          format: 'A4',
          printBackground: true,
        });

        console.log('done');
        await browser.close();
        //process.exit();
      } catch (e) {
        console.log('our errpr', e);
      }
    })();

    //Codigo QR
    const urlMh01 = 'https://webapp.dtes.mh.gob.sv/consultaPublica?ambiente=01&codGen=';
    const urlMh02 = ideCGE;
    const urlMh03 = '&fechaEmi=';
    const urlMh04 = ideFEC;

    // URL para generar el código QR
    //const url = 'https://www.youtube.com/';
    //const url = 'https://webapp.dtes.mh.gob.sv/consultaPublica?ambiente=01&codGen=28576AF5-EB91-4BB6-9FEE-753D0936ACFF&fechaEmi=2023-08-28';
    
    const url = urlMh01+urlMh02+urlMh03+urlMh04;
    
    qr.toFile(fileQr, url, function (err, code) {
      if (err) {
        return console.log('error');

      }
      {
        console.log(code);
        console.log('Código QR generado correctamente.');
      }

    });

    this.mailerService
      .sendMail({
        //to: ['calfaro@cel.gob.sv', 'cesar.alfaro@gmail.com'],
        to: ['calfaro@cel.gob.sv'],
        from: 'calfaro@cel.gob.sv',
        subject: 'Factura',
        // text: 'Bienvenido', // plaintext body
        html: '<h1>Bienvenido</h1>',
        //template: 'email-order-success',
        //template: 'factura_03',
        context: {
          url: `${serverUrl}/static/`,
          name: 'Cesar Alfaro',
          asunto: '',
          //people: ['Yehuda Katz', 'Alan Johnson', 'Charles Jolley'],
        },
        attachments: [
          {
            path: newFileJsonDocumento,
            contentType: 'application/json',
            filename: newFileJsonDocumento,
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

  public async example_puppeteer_09(): Promise<void> {
    const serverUrl = this.appContextService.getServerUrl();
    console.log('URL: ' + serverUrl);
    const nombre_archivo = 'qr_prueba';
    const fileQr = join(__dirname, '..', '..', 'public', `${nombre_archivo}.png`);

    const qr = require('qrcode');

    // URL para generar el código QR
    const url = 'https://webapp.dtes.mh.gob.sv/consultaPublica?ambiente=01&codGen=28576AF5-EB91-4BB6-9FEE-753D0936ACFF&fechaEmi=2023-08-28';

    qr.toFile(fileQr, url, function (err, code) {
      if (err) {
        return console.log('error');
        console.log(code);
      }
      {
        console.log('Código QR generado correctamente.');
      }

    });




  };


}
