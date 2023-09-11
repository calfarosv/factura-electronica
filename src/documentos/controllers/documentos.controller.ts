import { Controller, Get, Render } from '@nestjs/common';
import { DocumentosService } from '../services/documentos.service';

@Controller('documentos')
export class DocumentosController {
  constructor(private readonly docuemntosService: DocumentosService) { }



  @Get('pup_08')
  getPup_08(): string {
    return this.docuemntosService.getPup_08();
  }  


}
