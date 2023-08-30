import { ExecutionContext, Injectable } from '@nestjs/common';
import { Request } from 'express';

@Injectable()
export class AppContextService {
  private serverUrl: string;

  setServerUrl(req: Request) {
    const protocol = req.protocol;
    const host = req.get('host');
    this.serverUrl = `${protocol}://${host}`;
  }

  getServerUrl(): string {
    return this.serverUrl;
  }
}
