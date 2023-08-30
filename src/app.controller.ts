
import { Controller, Get, Request, Post, UseGuards, HttpStatus } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AppService } from './app.service';

//+++ agregando oauth y jwt ++++
//import { LocalAuthGuard } from './auth/local-auth.guard';
//import { AuthService } from './auth/auth.service';

//+++

@ApiTags('SISDTE')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('Autor')
  getAutor(): string {
    return this.appService.getElAutor();

  }
/*
  //auth
  @UseGuards(LocalAuthGuard)
  @Post('auth/login')
  async login(@Request() req) {
    return this.authService.login(req.user);
  }
  */

}

/*
import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
*/