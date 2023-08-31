import { Injectable } from '@nestjs/common';

var fecha = new Date();
var hora_actual = fecha.getHours();
const moment = require('moment')

let currentDate = moment().format('YYYY-MM-DD')
let currentTime = moment().format('hh:mm:ss')



@Injectable()
export class AppService {
  getHello(): string {
    return 'Funciona!' + '  ' + currentDate + '  ' + currentTime;
  }
  getElAutor(): string {
    return 'Autor: Cesar Alfaro';
  }
}
/*
import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }
}
*/