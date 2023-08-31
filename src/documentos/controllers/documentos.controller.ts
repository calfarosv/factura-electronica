import { Controller, Get, Render } from '@nestjs/common';
import { DocumentosService } from '../services/documentos.service';

@Controller('documentos')
export class DocumentosController {
  constructor(private readonly docuemntosService: DocumentosService) {}

  @Get()
  getHello(): string {
    return this.docuemntosService.getHello();
  }

  @Get('Autor')
  getAutor(): string {
    return this.docuemntosService.getElAutor();

  }

  @Get('pup')
  getPup(): string {
    return this.docuemntosService.getPup();

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
