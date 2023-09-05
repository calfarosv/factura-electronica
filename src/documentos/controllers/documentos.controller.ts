import { Controller, Get, Render } from '@nestjs/common';
import { DocumentosService } from '../services/documentos.service';

@Controller('documentos')
export class DocumentosController {
  constructor(private readonly docuemntosService: DocumentosService) { }

  @Get()
  getHello(): string {
    return this.docuemntosService.getHello();
  }

  @Get('Autor')
  getAutor(): string {
    return this.docuemntosService.getElAutor();

  }

  @Get('pup_01')
  getPup_01(): string {
    return this.docuemntosService.getPup_01();
  }

  @Get('pup_02')
  getPup_02(): string {
    return this.docuemntosService.getPup_02();
  }

  @Get('pup_03')
  getPup_03(): string {
    return this.docuemntosService.getPup_03();
  }

  @Get('pup_04')
  getPup_04(): string {
    return this.docuemntosService.getPup_04();
  }

  @Get('pup_05')
  getPup_05(): string {
    return this.docuemntosService.getPup_05();
  }

  @Get('pup_06')
  getPup_06(): string {
    return this.docuemntosService.getPup_06();
  }

  @Get('pup_07')
  getPup_07(): string {
    return this.docuemntosService.getPup_07();
  }  

  @Get('pup_08')
  getPup_08(): string {
    return this.docuemntosService.getPup_08();
  }  

  @Get('emisor')
  getEmisor() {
    return this.docuemntosService.getEmisor();
  }

  @Get('factura/:id')
  @Render('layouts/factura') // Renderiza el archivo "factura.hbs"
  getHome() {
    // Puedes pasar datos a tu plantilla Handlebars si es necesario
    return {
      title: 'Esta es home',
      url: 'http://localhost:3003/static/',
      cargarPage: false,
    };
  }
}
