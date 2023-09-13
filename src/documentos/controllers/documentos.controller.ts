import { Controller, Get, Render } from '@nestjs/common';
import { DocumentosService } from '../services/documentos.service';

@Controller('documentos')
export class DocumentosController {
  constructor(private readonly docuemntosService: DocumentosService) { }



  @Get('genera_documento')
  genera_documento(): string {
    return this.docuemntosService.genera_documento();
  }  


}
