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
    const fs = require("fs"); //puppeter
    console.log('URL: ' + serverUrl);
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
        //template: 'factura_01',
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
    const nombre_archivo = 'cesar_factura'+ '_' + currentDate + '_' + currentTime;
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
    const nombre_archivo = 'prueba_'+ '_' + currentDate + '_' + currentTime;
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
    console.log('formatting',value, format);
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
    const moment_hora = require('moment');
    let currentDate = moment_hora().format('YYYY-MM-DD');
    let currentTime = moment_hora().format('hh-mm-ss');
    const nombre_archivo = 'prueba_'+ '_' + currentDate + '_' + currentTime;
    const puppeteer = require('puppeteer');
    const fs = require('fs-extra');
    const hbs = require('handlebars');
    const path = require('path');
    const datos = require(join(__dirname, '..', '..', 'public', 'cf_cel.json'));
    const tempPdfEjemplo = join(__dirname, '..', '..', 'public', `${nombre_archivo}.pdf`);
    const moment = require('moment');
    
    
   const compile = async function (templateName, datos) {
    const filePath = path.join(process.cwd(), 'templates', `${templateName}.hbs`);
    const html = await fs.readFile(filePath, 'utf-8');
    //console.log(html);
    return hbs.compile(html)(datos);
  };
   
  hbs.registerHelper('dateFormat', function (value, format) {
    console.log('formatting',value, format);
    return moment(value).format(format);
  });

    (async function () { 
      try {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();

        console.log(datos);
        const content = await compile('factura_02', datos);

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
  
}
