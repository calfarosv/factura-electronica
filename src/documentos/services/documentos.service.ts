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

@Injectable()
export class DocumentosService {
  constructor(
    private readonly mailerService: MailerService,
    private readonly appContextService: AppContextService,
    private readonly httpService: HttpService,
    @InjectRepository(DteEmisor)
    private readonly emisorRepository: Repository<DteEmisor>,
  ) {}

  getHello(): string {
    this.example();
    return 'Hello World!';
  }

  async getEmisor(): Promise<DteEmisor> {
    const emisor = await this.emisorRepository.findOneBy({ id: 1 }).then();
    return emisor;
  }

  public async example(): Promise<void> {
    const serverUrl = this.appContextService.getServerUrl();
    console.log('URL: ' + serverUrl);
    console.log(join(__dirname, '..', '..', 'public', 'temporal.json'));
    const response = await firstValueFrom(
      this.httpService.get('https://jsonplaceholder.typicode.com/users/1'),
    );

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
        ],
      })
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      .then(() => {})
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      .catch(() => {});
  }
}
