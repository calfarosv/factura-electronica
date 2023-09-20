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


  genera_documento() {
    let jsonDte_01;
    let jsonDte_03;
    let jsonDte_05;
    let jsonDte_07;    

    jsonDte_01 = 
    {
      identificacion: {
        fecEmi: "2023-08-21",
        horEmi: "16:01:09",
        tipoDte: "01",
        version: 1,
        ambiente: "00",
        tipoModelo: 1,
        tipoMoneda: "USD",
        motivoContin: null,
        numeroControl: "DTE-01-00000000-000000000000090",
        tipoOperacion: 1,
        codigoGeneracion: "03754C2B-E078-3A11-E064-00144FFB12D3",
        tipoContingencia: null
      },
      documentoRelacionado: null,
      emisor: {
        nit: "06141809480014",
        nrc: "81981",
        nombre: "COMISIÓN EJECUTIVA HIDROELÉCTRICA DEL RÍO LEMPA",
        codActividad: "35101",
        descActividad: "Generación de energía eléctrica",
        nombreComercial: "COMISIÓN EJECUTIVA HIDROELÉCTRICA DEL RÍO LEMPA",
        tipoEstablecimiento: "01",
        direccion: {
          municipio: "14",
          complemento: "9° CALLE PONIENTE 17° AV. NORTE, CENTRO DE GOBIERNO, # 950, SAN SALVADOR, EL SALVADOR",
          departamento: "06"
        },
        telefono: "22116000",
        correo: "info@cel.gob.sv",
        codEstableMH: null,
        codEstable: null,
        codPuntoVentaMH: null,
        codPuntoVenta: null
      },
      receptor: {
        nrc: null,
        nombre: "FLOR DE MARIA RECINOS ABARCA",
        codActividad: "10001",
        descActividad: "Empleados",
        direccion: {
          municipio: null,
          complemento: "CALLE LA RONDA, BARRIO EL CENTRO, POTONICO, DEPTO. CHALATENANGO",
          departamento: null
        },
        telefono: "2327-8796",
        correo: "fmrecinos@cel.gob.sv",
        tipoDocumento: "13",
        numDocumento: "03839339-8"
      },
      cuerpoDocumento: [
        {
          psv: 0,
          codigo: null,
          numItem: 1,
          cantidad: 1,
          tipoItem: 3,
          tributos: null,
          noGravado: 0,
          precioUni: 35.23,
          uniMedida: 59,
          codTributo: null,
          montoDescu: 0,
          ventaNoSuj: 0,
          descripcion: "SUMINISTRO DE ENERGIA ELECTRICA A JOSÉ EFRAIN RECINOS VIDES CORRESPONDIENTE AL MES DE ABRIL/2023 SEGUN INFORME DE CONSUMO No 64052 ADJUNTO POR 175.00 KWh 8711004 Planilla 2",
          ventaExenta: 0,
          ventaGravada: 35.23,
          numeroDocumento: null,
          ivaItem: 4.05
        }
      ],
      resumen: {
        pagos: [
          {
            plazo: "01",
            codigo: "13",
            periodo: 19,
            montoPago: 35.23,
            referencia: null
          }
        ],
        ivaRete1: 0,
        subTotal: 35.23,
        tributos: [],
        reteRenta: 0,
        descuNoSuj: 0,
        saldoFavor: 0,
        totalDescu: 0,
        totalNoSuj: 0,
        totalPagar: 35.13,
        descuExenta: 0,
        totalExenta: 0,
        totalLetras: "TREINTA Y CINCO  DÓLARES CON 23/100",
        descuGravada: 0,
        totalGravada: 35.23,
        subTotalVentas: 35.21,
        totalNoGravado: 0,
        condicionOperacion: 2,
        numPagoElectronico: null,
        montoTotalOperacion: 35.23,
        porcentajeDescuento: 0,
        totalIva: 4.05
      },
      otrosDocumentos: null,
      ventaTercero: null,
      extension: null,
      apendice: null,
      firmaElectronica: "eyJhbGciOiJSUzUxMiJ9.ewogICJpZGVudGlmaWNhY2lvbiIgOiB7CiAgICAiZmVjRW1pIiA6ICIyMDIzLTA4LTIxIiwKICAgICJob3JFbWkiIDogIjE2OjAxOjA5IiwKICAgICJ0aXBvRHRlIiA6ICIwMSIsCiAgICAidmVyc2lvbiIgOiAxLAogICAgImFtYmllbnRlIiA6ICIwMCIsCiAgICAidGlwb01vZGVsbyIgOiAxLAogICAgInRpcG9Nb25lZGEiIDogIlVTRCIsCiAgICAibW90aXZvQ29udGluIiA6IG51bGwsCiAgICAibnVtZXJvQ29udHJvbCIgOiAiRFRFLTAxLTAwMDAwMDAwLTAwMDAwMDAwMDAwMDA5MCIsCiAgICAidGlwb09wZXJhY2lvbiIgOiAxLAogICAgImNvZGlnb0dlbmVyYWNpb24iIDogIjAzNzU0QzJCLUUwNzgtM0ExMS1FMDY0LTAwMTQ0RkZCMTJEMyIsCiAgICAidGlwb0NvbnRpbmdlbmNpYSIgOiBudWxsCiAgfSwKICAiZG9jdW1lbnRvUmVsYWNpb25hZG8iIDogbnVsbCwKICAiZW1pc29yIiA6IHsKICAgICJuaXQiIDogIjA2MTQxODA5NDgwMDE0IiwKICAgICJucmMiIDogIjgxOTgxIiwKICAgICJub21icmUiIDogIkNPTUlTScOTTiBFSkVDVVRJVkEgSElEUk9FTMOJQ1RSSUNBIERFTCBSw41PIExFTVBBIiwKICAgICJjb2RBY3RpdmlkYWQiIDogIjM1MTAxIiwKICAgICJkZXNjQWN0aXZpZGFkIiA6ICJHZW5lcmFjacOzbiBkZSBlbmVyZ8OtYSBlbMOpY3RyaWNhIiwKICAgICJub21icmVDb21lcmNpYWwiIDogIkNPTUlTScOTTiBFSkVDVVRJVkEgSElEUk9FTMOJQ1RSSUNBIERFTCBSw41PIExFTVBBIiwKICAgICJ0aXBvRXN0YWJsZWNpbWllbnRvIiA6ICIwMSIsCiAgICAiZGlyZWNjaW9uIiA6IHsKICAgICAgIm11bmljaXBpbyIgOiAiMTQiLAogICAgICAiY29tcGxlbWVudG8iIDogIjnCsCBDQUxMRSBQT05JRU5URSAxN8KwIEFWLiBOT1JURSwgQ0VOVFJPIERFIEdPQklFUk5PLCAjIDk1MCwgU0FOIFNBTFZBRE9SLCBFTCBTQUxWQURPUiIsCiAgICAgICJkZXBhcnRhbWVudG8iIDogIjA2IgogICAgfSwKICAgICJ0ZWxlZm9ubyIgOiAiMjIxMTYwMDAiLAogICAgImNvcnJlbyIgOiAiaW5mb0BjZWwuZ29iLnN2IiwKICAgICJjb2RFc3RhYmxlTUgiIDogbnVsbCwKICAgICJjb2RFc3RhYmxlIiA6IG51bGwsCiAgICAiY29kUHVudG9WZW50YU1IIiA6IG51bGwsCiAgICAiY29kUHVudG9WZW50YSIgOiBudWxsCiAgfSwKICAicmVjZXB0b3IiIDogewogICAgIm5yYyIgOiBudWxsLAogICAgIm5vbWJyZSIgOiAiRkxPUiBERSBNQVJJQSBSRUNJTk9TIEFCQVJDQSIsCiAgICAiY29kQWN0aXZpZGFkIiA6ICIxMDAwMSIsCiAgICAiZGVzY0FjdGl2aWRhZCIgOiAiRW1wbGVhZG9zIiwKICAgICJkaXJlY2Npb24iIDogewogICAgICAibXVuaWNpcGlvIiA6IG51bGwsCiAgICAgICJjb21wbGVtZW50byIgOiAiQ0FMTEUgTEEgUk9OREEsIEJBUlJJTyBFTCBDRU5UUk8sIFBPVE9OSUNPLCBERVBUTy4gQ0hBTEFURU5BTkdPIiwKICAgICAgImRlcGFydGFtZW50byIgOiBudWxsCiAgICB9LAogICAgInRlbGVmb25vIiA6ICIyMzI3LTg3OTYiLAogICAgImNvcnJlbyIgOiAiZm1yZWNpbm9zQGNlbC5nb2Iuc3YiLAogICAgInRpcG9Eb2N1bWVudG8iIDogIjEzIiwKICAgICJudW1Eb2N1bWVudG8iIDogIjAzODM5MzM5LTgiCiAgfSwKICAiY3VlcnBvRG9jdW1lbnRvIiA6IFsgewogICAgInBzdiIgOiAwLAogICAgImNvZGlnbyIgOiBudWxsLAogICAgIm51bUl0ZW0iIDogMSwKICAgICJjYW50aWRhZCIgOiAxLAogICAgInRpcG9JdGVtIiA6IDMsCiAgICAidHJpYnV0b3MiIDogbnVsbCwKICAgICJub0dyYXZhZG8iIDogMCwKICAgICJwcmVjaW9VbmkiIDogMzUuMjMsCiAgICAidW5pTWVkaWRhIiA6IDU5LAogICAgImNvZFRyaWJ1dG8iIDogbnVsbCwKICAgICJtb250b0Rlc2N1IiA6IDAsCiAgICAidmVudGFOb1N1aiIgOiAwLAogICAgImRlc2NyaXBjaW9uIiA6ICJTVU1JTklTVFJPIERFIEVORVJHSUEgRUxFQ1RSSUNBIEEgSk9Tw4kgRUZSQUlOIFJFQ0lOT1MgVklERVMgQ09SUkVTUE9ORElFTlRFIEFMIE1FUyBERSBBQlJJTC8yMDIzIFNFR1VOIElORk9STUUgREUgQ09OU1VNTyBObyA2NDA1MiBBREpVTlRPIFBPUiAxNzUuMDAgS1doIDg3MTEwMDQgUGxhbmlsbGEgMiIsCiAgICAidmVudGFFeGVudGEiIDogMCwKICAgICJ2ZW50YUdyYXZhZGEiIDogMzUuMjMsCiAgICAibnVtZXJvRG9jdW1lbnRvIiA6IG51bGwsCiAgICAiaXZhSXRlbSIgOiA0LjA1CiAgfSBdLAogICJyZXN1bWVuIiA6IHsKICAgICJwYWdvcyIgOiBbIHsKICAgICAgInBsYXpvIiA6ICIwMSIsCiAgICAgICJjb2RpZ28iIDogIjEzIiwKICAgICAgInBlcmlvZG8iIDogMTksCiAgICAgICJtb250b1BhZ28iIDogMzUuMjMsCiAgICAgICJyZWZlcmVuY2lhIiA6IG51bGwKICAgIH0gXSwKICAgICJpdmFSZXRlMSIgOiAwLAogICAgInN1YlRvdGFsIiA6IDM1LjIzLAogICAgInRyaWJ1dG9zIiA6IFsgXSwKICAgICJyZXRlUmVudGEiIDogMCwKICAgICJkZXNjdU5vU3VqIiA6IDAsCiAgICAic2FsZG9GYXZvciIgOiAwLAogICAgInRvdGFsRGVzY3UiIDogMCwKICAgICJ0b3RhbE5vU3VqIiA6IDAsCiAgICAidG90YWxQYWdhciIgOiAzNS4xMywKICAgICJkZXNjdUV4ZW50YSIgOiAwLAogICAgInRvdGFsRXhlbnRhIiA6IDAsCiAgICAidG90YWxMZXRyYXMiIDogIlRSRUlOVEEgWSBDSU5DTyAgRMOTTEFSRVMgQ09OIDIzLzEwMCIsCiAgICAiZGVzY3VHcmF2YWRhIiA6IDAsCiAgICAidG90YWxHcmF2YWRhIiA6IDM1LjIzLAogICAgInN1YlRvdGFsVmVudGFzIiA6IDM1LjIxLAogICAgInRvdGFsTm9HcmF2YWRvIiA6IDAsCiAgICAiY29uZGljaW9uT3BlcmFjaW9uIiA6IDIsCiAgICAibnVtUGFnb0VsZWN0cm9uaWNvIiA6IG51bGwsCiAgICAibW9udG9Ub3RhbE9wZXJhY2lvbiIgOiAzNS4yMywKICAgICJwb3JjZW50YWplRGVzY3VlbnRvIiA6IDAsCiAgICAidG90YWxJdmEiIDogNC4wNQogIH0sCiAgIm90cm9zRG9jdW1lbnRvcyIgOiBudWxsLAogICJ2ZW50YVRlcmNlcm8iIDogbnVsbCwKICAiZXh0ZW5zaW9uIiA6IG51bGwsCiAgImFwZW5kaWNlIiA6IG51bGwKfQ.gSrweDIos7dZwGDBhUJAnCfoxwIl_v3Igf8Gh8o8SUIhfAyr2WFsjhci2HeRstrZB8UmUTbwggIKz2XiKlNoQ0XjaXt1lcZ0__dyWeo_NzW5q00qKngTY_4NfXYVTiqgMIcu8RdK2Dz2s4S7mUeY7jFEKNbaCxOU-g32-G5tKmdKjPxHM69Fx5DWkse5GV4JMYRvsVsMDco9hq6cWmu_0lESqxndJT40sTD4SPKHrJPAzsTnA36sElwKVSSy-P61GUfvAPqdvWb6f39ByBkdpaZ4611ieohlVz8obFn5EF7YJ-uFprJ-MK8sYLdM0WfLDTrzNab9qWSPirfP4wYRag",
      selloRecibido: "2023E7C54C101E784BB6A45568E1F53C25154321"
    }


    jsonDte_03 =
    {
        identificacion: {
          fecEmi: "2023-09-19",
          horEmi: "1719:25",
          tipoDte:"03",
          version:3,
          ambiente:"00",
          tipoModelo: 1,
          tipoMoneda: "USD",
          motivoContin: null,
          numeroControl: "DTE-03-00000000-000000000000093",
          tipoOperacion: 1,
          codigoGeneracion: "05BA6CA6-6613-14F9-E064-00144FFB12D3",
          tipoContingencia: null
        },
        documentoRelacionado: null,
        emisor: {
          nit: "06141809480014",
          nrc: "81981",
          nombre: "COMISIÓN EJECUTIVA HIDROELÉCTRICA DEL RÍO LEMPA",
          codActividad: "35101",
          descActividad: "Generación de energía eléctrica",
          nombreComercial: "COMISIÓN EJECUTIVA HIDROELÉCTRICA DEL RÍO LEMPA",
          tipoEstablecimiento: "01",
          direccion: {
            municipio: "14",
            complemento: "9° CALLE PONIENTE 17° AV. NORTE, CENTRO DE GOBIERNO, # 950, SAN SALVADOR, EL SALVADOR",
            departamento: "06"
          },
          telefono: "22116000",
          correo: "info@cel.gob.sv",
          codEstableMH: null,
          codEstable: null,
          codPuntoVentaMH: null,
          codPuntoVenta: null
        },
        receptor: {
          nit: "11232607570010",
          nrc: "32670",
          nombre: "DISTRIBUIDORA ELECTRICA DE USULUTAN S.A. DE C.V.",
          codActividad: "35103",
          descActividad: "Distribución de energía eléctrica",
          nombreComercial: "DEUSEM, S.A. DE C.V.",
          direccion: {
            municipio: "23",
            complemento: "LOCAL 2, CTRO COM. PUERTA DE ORIENTE",
            departamento: "11"
          },
          telefono: "2622-4000",
          correo: "sisdte@cel.gob.sv"
        },
        cuerpoDocumento: [
          {
            psv: 0,
            codigo: null,
            numItem: 1,
            cantidad: 1,
            tipoItem: 3,
            tributos: [
              "20"
            ],
            noGravado: 0,
            precioUni: 23.42,
            uniMedida: 59,
            codTributo: null,
            montoDescu: 0,
            ventaNoSuj: 0,
            descripcion: "DESV. NEG. MAR/2023 POR 202.70 KWH",
            ventaExenta: 0,
            ventaGravada: 23.42,
            numeroDocumento: null
          },
          {
            psv: 0,
            codigo: null,
            numItem: 2,
            cantidad: 1,
            tipoItem: 3,
            tributos: [
              "20"
            ],
            noGravado: 0,
            precioUni: 0.07,
            uniMedida: 59,
            codTributo: null,
            montoDescu: 0,
            ventaNoSuj: 0,
            descripcion: "INTERESES POR DESV. NEG. MAR/2023",
            ventaExenta: 0,
            ventaGravada: 0.07,
            numeroDocumento: null
          }
        ],
        resumen: {
          pagos: [
            {
              plazo: "01",
              codigo: "04",
              periodo: 7,
              montoPago: 26.54,
              referencia: null
            }
          ],
          ivaRete1: 0,
          subTotal: 23.49,
          tributos: [
            {
              codigo: "20",
              descripcion: "Impuesto al Valor Agregado 13%",
              valor: 3.05
            }
          ],
          ivaPerci1: 0,
          reteRenta: 0,
          descuNoSuj: 0,
          saldoFavor: 0,
          totalDescu: 0,
          totalNoSuj: 0,
          totalPagar: 26.54,
          descuExenta: 0,
          totalExenta: 0,
          totalLetras: "VEINTISEIS  DÓLARES CON 54/100",
          descuGravada: 0,
          totalGravada: 23.49,
          subTotalVentas: 23.49,
          totalNoGravado: 0,
          condicionOperacion: 2,
          numPagoElectronico: null,
          montoTotalOperacion: 26.54,
          porcentajeDescuento: 0
        },
        otrosDocumentos: null,
        ventaTercero: null,
        extension: null,
        apendice: null,
        firmaElectronica: "eyJhbGciOiJSUzUxMiJ9.ewogICJpZGVudGlmaWNhY2lvbiIgOiB7CiAgICAiZmVjRW1pIiA6ICIyMDIzLTA5LTE5IiwKICAgICJob3JFbWkiIDogIjE3OjE5OjI1IiwKICAgICJ0aXBvRHRlIiA6ICIwMyIsCiAgICAidmVyc2lvbiIgOiAzLAogICAgImFtYmllbnRlIiA6ICIwMCIsCiAgICAidGlwb01vZGVsbyIgOiAxLAogICAgInRpcG9Nb25lZGEiIDogIlVTRCIsCiAgICAibW90aXZvQ29udGluIiA6IG51bGwsCiAgICAibnVtZXJvQ29udHJvbCIgOiAiRFRFLTAzLTAwMDAwMDAwLTAwMDAwMDAwMDAwMDA5MyIsCiAgICAidGlwb09wZXJhY2lvbiIgOiAxLAogICAgImNvZGlnb0dlbmVyYWNpb24iIDogIjA1QkE2Q0E2LTY2MTMtMTRGOS1FMDY0LTAwMTQ0RkZCMTJEMyIsCiAgICAidGlwb0NvbnRpbmdlbmNpYSIgOiBudWxsCiAgfSwKICAiZG9jdW1lbnRvUmVsYWNpb25hZG8iIDogbnVsbCwKICAiZW1pc29yIiA6IHsKICAgICJuaXQiIDogIjA2MTQxODA5NDgwMDE0IiwKICAgICJucmMiIDogIjgxOTgxIiwKICAgICJub21icmUiIDogIkNPTUlTScOTTiBFSkVDVVRJVkEgSElEUk9FTMOJQ1RSSUNBIERFTCBSw41PIExFTVBBIiwKICAgICJjb2RBY3RpdmlkYWQiIDogIjM1MTAxIiwKICAgICJkZXNjQWN0aXZpZGFkIiA6ICJHZW5lcmFjacOzbiBkZSBlbmVyZ8OtYSBlbMOpY3RyaWNhIiwKICAgICJub21icmVDb21lcmNpYWwiIDogIkNPTUlTScOTTiBFSkVDVVRJVkEgSElEUk9FTMOJQ1RSSUNBIERFTCBSw41PIExFTVBBIiwKICAgICJ0aXBvRXN0YWJsZWNpbWllbnRvIiA6ICIwMSIsCiAgICAiZGlyZWNjaW9uIiA6IHsKICAgICAgIm11bmljaXBpbyIgOiAiMTQiLAogICAgICAiY29tcGxlbWVudG8iIDogIjnCsCBDQUxMRSBQT05JRU5URSAxN8KwIEFWLiBOT1JURSwgQ0VOVFJPIERFIEdPQklFUk5PLCAjIDk1MCwgU0FOIFNBTFZBRE9SLCBFTCBTQUxWQURPUiIsCiAgICAgICJkZXBhcnRhbWVudG8iIDogIjA2IgogICAgfSwKICAgICJ0ZWxlZm9ubyIgOiAiMjIxMTYwMDAiLAogICAgImNvcnJlbyIgOiAiaW5mb0BjZWwuZ29iLnN2IiwKICAgICJjb2RFc3RhYmxlTUgiIDogbnVsbCwKICAgICJjb2RFc3RhYmxlIiA6IG51bGwsCiAgICAiY29kUHVudG9WZW50YU1IIiA6IG51bGwsCiAgICAiY29kUHVudG9WZW50YSIgOiBudWxsCiAgfSwKICAicmVjZXB0b3IiIDogewogICAgIm5pdCIgOiAiMTEyMzI2MDc1NzAwMTAiLAogICAgIm5yYyIgOiAiMzI2NzAiLAogICAgIm5vbWJyZSIgOiAiRElTVFJJQlVJRE9SQSBFTEVDVFJJQ0EgREUgVVNVTFVUQU4gUy5BLiBERSBDLlYuIiwKICAgICJjb2RBY3RpdmlkYWQiIDogIjM1MTAzIiwKICAgICJkZXNjQWN0aXZpZGFkIiA6ICJEaXN0cmlidWNpw7NuIGRlIGVuZXJnw61hIGVsw6ljdHJpY2EiLAogICAgIm5vbWJyZUNvbWVyY2lhbCIgOiAiREVVU0VNLCBTLkEuIERFIEMuVi4iLAogICAgImRpcmVjY2lvbiIgOiB7CiAgICAgICJtdW5pY2lwaW8iIDogIjIzIiwKICAgICAgImNvbXBsZW1lbnRvIiA6ICJMT0NBTCAyLCBDVFJPIENPTS4gUFVFUlRBIERFIE9SSUVOVEUiLAogICAgICAiZGVwYXJ0YW1lbnRvIiA6ICIxMSIKICAgIH0sCiAgICAidGVsZWZvbm8iIDogIjI2MjItNDAwMCIsCiAgICAiY29ycmVvIiA6ICJzaXNkdGVAY2VsLmdvYi5zdiIKICB9LAogICJjdWVycG9Eb2N1bWVudG8iIDogWyB7CiAgICAicHN2IiA6IDAsCiAgICAiY29kaWdvIiA6IG51bGwsCiAgICAibnVtSXRlbSIgOiAxLAogICAgImNhbnRpZGFkIiA6IDEsCiAgICAidGlwb0l0ZW0iIDogMywKICAgICJ0cmlidXRvcyIgOiBbICIyMCIgXSwKICAgICJub0dyYXZhZG8iIDogMCwKICAgICJwcmVjaW9VbmkiIDogMjMuNDIsCiAgICAidW5pTWVkaWRhIiA6IDU5LAogICAgImNvZFRyaWJ1dG8iIDogbnVsbCwKICAgICJtb250b0Rlc2N1IiA6IDAsCiAgICAidmVudGFOb1N1aiIgOiAwLAogICAgImRlc2NyaXBjaW9uIiA6ICJERVNWLiBORUcuIE1BUi8yMDIzIFBPUiAyMDIuNzAgS1dIIiwKICAgICJ2ZW50YUV4ZW50YSIgOiAwLAogICAgInZlbnRhR3JhdmFkYSIgOiAyMy40MiwKICAgICJudW1lcm9Eb2N1bWVudG8iIDogbnVsbAogIH0sIHsKICAgICJwc3YiIDogMCwKICAgICJjb2RpZ28iIDogbnVsbCwKICAgICJudW1JdGVtIiA6IDIsCiAgICAiY2FudGlkYWQiIDogMSwKICAgICJ0aXBvSXRlbSIgOiAzLAogICAgInRyaWJ1dG9zIiA6IFsgIjIwIiBdLAogICAgIm5vR3JhdmFkbyIgOiAwLAogICAgInByZWNpb1VuaSIgOiAwLjA3LAogICAgInVuaU1lZGlkYSIgOiA1OSwKICAgICJjb2RUcmlidXRvIiA6IG51bGwsCiAgICAibW9udG9EZXNjdSIgOiAwLAogICAgInZlbnRhTm9TdWoiIDogMCwKICAgICJkZXNjcmlwY2lvbiIgOiAiSU5URVJFU0VTIFBPUiBERVNWLiBORUcuIE1BUi8yMDIzIiwKICAgICJ2ZW50YUV4ZW50YSIgOiAwLAogICAgInZlbnRhR3JhdmFkYSIgOiAwLjA3LAogICAgIm51bWVyb0RvY3VtZW50byIgOiBudWxsCiAgfSBdLAogICJyZXN1bWVuIiA6IHsKICAgICJwYWdvcyIgOiBbIHsKICAgICAgInBsYXpvIiA6ICIwMSIsCiAgICAgICJjb2RpZ28iIDogIjA0IiwKICAgICAgInBlcmlvZG8iIDogNywKICAgICAgIm1vbnRvUGFnbyIgOiAyNi41NCwKICAgICAgInJlZmVyZW5jaWEiIDogbnVsbAogICAgfSBdLAogICAgIml2YVJldGUxIiA6IDAsCiAgICAic3ViVG90YWwiIDogMjMuNDksCiAgICAidHJpYnV0b3MiIDogWyB7CiAgICAgICJjb2RpZ28iIDogIjIwIiwKICAgICAgImRlc2NyaXBjaW9uIiA6ICJJbXB1ZXN0byBhbCBWYWxvciBBZ3JlZ2FkbyAxMyUiLAogICAgICAidmFsb3IiIDogMy4wNQogICAgfSBdLAogICAgIml2YVBlcmNpMSIgOiAwLAogICAgInJldGVSZW50YSIgOiAwLAogICAgImRlc2N1Tm9TdWoiIDogMCwKICAgICJzYWxkb0Zhdm9yIiA6IDAsCiAgICAidG90YWxEZXNjdSIgOiAwLAogICAgInRvdGFsTm9TdWoiIDogMCwKICAgICJ0b3RhbFBhZ2FyIiA6IDI2LjU0LAogICAgImRlc2N1RXhlbnRhIiA6IDAsCiAgICAidG90YWxFeGVudGEiIDogMCwKICAgICJ0b3RhbExldHJhcyIgOiAiVkVJTlRJU0VJUyAgRMOTTEFSRVMgQ09OIDU0LzEwMCIsCiAgICAiZGVzY3VHcmF2YWRhIiA6IDAsCiAgICAidG90YWxHcmF2YWRhIiA6IDIzLjQ5LAogICAgInN1YlRvdGFsVmVudGFzIiA6IDIzLjQ5LAogICAgInRvdGFsTm9HcmF2YWRvIiA6IDAsCiAgICAiY29uZGljaW9uT3BlcmFjaW9uIiA6IDIsCiAgICAibnVtUGFnb0VsZWN0cm9uaWNvIiA6IG51bGwsCiAgICAibW9udG9Ub3RhbE9wZXJhY2lvbiIgOiAyNi41NCwKICAgICJwb3JjZW50YWplRGVzY3VlbnRvIiA6IDAKICB9LAogICJvdHJvc0RvY3VtZW50b3MiIDogbnVsbCwKICAidmVudGFUZXJjZXJvIiA6IG51bGwsCiAgImV4dGVuc2lvbiIgOiBudWxsLAogICJhcGVuZGljZSIgOiBudWxsCn0.SF6IzKJK7IPa_T6ieJIBFsSG9qnAf3NocsR_LrnyuvaGZt1bbdcP5X05_Lu9sKBiTzLUaPn2ZYd3L5h4fh9lJMPQtMoDsxwhq86ULWoWs1DN7SJ4UNm07lNB-ZclMpS5JJNslP3PNSMOtvEpbvx2OlRKtA2yVaPMTS3Uod2-vUJtqrW1zXXZq-mwY42K0iRH6oWzk0VydbZAYf34aC8EMEactW2ZwB7KHJSuncSdi4pK9zbTK1jeAqFOYBaBOkS3vdhQuBWWypWGlEBpkOGgxx3qD1SJFSP8v0urkt9_4uJduepWULuCYu9yb4fFPtGfwJZh6grYW-68fjt8-P7_fQ",
        selloRecibido: "20239E4C3C42E9BD41B8B5CCB24DF3A66C32GHHE"
      }

    jsonDte_05 =
    {
      identificacion: {
        fecEmi: "2023-09-18",
        horEmi: "11:13:22",
        tipoDte: "05",
        version: 3,
        ambiente: "00",
        tipoModelo: 1,
        tipoMoneda: "USD",
        motivoContin: null,
        numeroControl: "DTE-05-00000000-000000000000002",
        tipoOperacion: 1,
        codigoGeneracion: "03754C2B-E0C5-3A11-E064-00144FFB12D3",
        tipoContingencia: null
      },
      documentoRelacionado: [
        {
          fechaEmision: "2022-07-11",
          tipoDocumento: "03",
          tipoGeneracion: 1,
          numeroDocumento: "190"
        }
      ],
      emisor: {
        nit: "06141809480014",
        nrc: "81981",
        nombre: "COMISIÓN EJECUTIVA HIDROELÉCTRICA DEL RÍO LEMPA",
        codActividad: "35101",
        descActividad: "Generación de energía eléctrica",
        nombreComercial: "COMISIÓN EJECUTIVA HIDROELÉCTRICA DEL RÍO LEMPA",
        tipoEstablecimiento: "01",
        direccion: {
          municipio: "14",
          complemento: "9° CALLE PONIENTE 17° AV. NORTE, CENTRO DE GOBIERNO, # 950, SAN SALVADOR, EL SALVADOR",
          departamento: "06"
        },
        telefono: "22116000",
        correo: "info@cel.gob.sv"
      },
      receptor: {
        nit: "06142402991047",
        nrc: "1136024",
        nombre: "EMPRESA TRANSMISORA DE EL SALVADOR, S.A. DE C.V.",
        codActividad: "35102",
        descActividad: "Transmisión de energía eléctrica",
        nombreComercial: "ETESAL, S.A. DE C.V.",
        direccion: {
          municipio: "10",
          complemento: "CALLE PRIMAVERA, RES. PRIMAVERA, # 11, SANTA TECLA, LA LIBERTAD",
          departamento: "05"
        },
        telefono: "2507-6600",
        correo: "sisdte@cel.gob.sv"
      },
      cuerpoDocumento: [
        {
          codigo: null,
          numItem: 1,
          cantidad: 1,
          tipoItem: 3,
          tributos: [
            20
          ],
          precioUni: 1194.39,
          uniMedida: 59,
          codTributo: null,
          montoDescu: 0,
          ventaNoSuj: 0,
          descripcion: "AJUSTE AL SUMINISTRO DE ENERGIA ELECTRICA EN SUBESTACIONES CORRESPONDIENTE AL MES DE JUNIO DE 2022 POR 421,474.642 KWH SEGUN MODIFICACION NO. 1 AL CONTRATO CEL-3688-S APLICADO AL CCF 190 DEL  11072022",
          ventaExenta: 0,
          ventaGravada: 1194.39,
          numeroDocumento: "190"
        }
      ],
      resumen: {
        ivaRete1: 0,
        subTotal: 1194.39,
        tributos: [
          {
            codigo: "20",
            descripcion: "Impuesto al Valor Agregado 13%",
            valor: 155.27
          }
        ],
        ivaPerci1: 0,
        reteRenta: 0,
        descuNoSuj: 0,
        totalDescu: 0,
        totalNoSuj: 0,
        descuExenta: 0,
        totalExenta: 0,
        totalLetras: "UN MIL TRESCIENTOS CUARENTA Y NUEVE  DÓLARES CON 66/100",
        descuGravada: 0,
        totalGravada: 1194.39,
        subTotalVentas: 1194.39,
        condicionOperacion: 1,
        montoTotalOperacion: 1349.66
      },
      ventaTercero: null,
      extension: null,
      apendice: null,
      firmaElectronica: "eyJhbGciOiJSUzUxMiJ9.ewogICJpZGVudGlmaWNhY2lvbiIgOiB7CiAgICAiZmVjRW1pIiA6ICIyMDIzLTA5LTE4IiwKICAgICJob3JFbWkiIDogIjExOjEzOjIyIiwKICAgICJ0aXBvRHRlIiA6ICIwNSIsCiAgICAidmVyc2lvbiIgOiAzLAogICAgImFtYmllbnRlIiA6ICIwMCIsCiAgICAidGlwb01vZGVsbyIgOiAxLAogICAgInRpcG9Nb25lZGEiIDogIlVTRCIsCiAgICAibW90aXZvQ29udGluIiA6IG51bGwsCiAgICAibnVtZXJvQ29udHJvbCIgOiAiRFRFLTA1LTAwMDAwMDAwLTAwMDAwMDAwMDAwMDAwMiIsCiAgICAidGlwb09wZXJhY2lvbiIgOiAxLAogICAgImNvZGlnb0dlbmVyYWNpb24iIDogIjAzNzU0QzJCLUUwQzUtM0ExMS1FMDY0LTAwMTQ0RkZCMTJEMyIsCiAgICAidGlwb0NvbnRpbmdlbmNpYSIgOiBudWxsCiAgfSwKICAiZG9jdW1lbnRvUmVsYWNpb25hZG8iIDogWyB7CiAgICAiZmVjaGFFbWlzaW9uIiA6ICIyMDIyLTA3LTExIiwKICAgICJ0aXBvRG9jdW1lbnRvIiA6ICIwMyIsCiAgICAidGlwb0dlbmVyYWNpb24iIDogMSwKICAgICJudW1lcm9Eb2N1bWVudG8iIDogIjE5MCIKICB9IF0sCiAgImVtaXNvciIgOiB7CiAgICAibml0IiA6ICIwNjE0MTgwOTQ4MDAxNCIsCiAgICAibnJjIiA6ICI4MTk4MSIsCiAgICAibm9tYnJlIiA6ICJDT01JU0nDk04gRUpFQ1VUSVZBIEhJRFJPRUzDiUNUUklDQSBERUwgUsONTyBMRU1QQSIsCiAgICAiY29kQWN0aXZpZGFkIiA6ICIzNTEwMSIsCiAgICAiZGVzY0FjdGl2aWRhZCIgOiAiR2VuZXJhY2nDs24gZGUgZW5lcmfDrWEgZWzDqWN0cmljYSIsCiAgICAibm9tYnJlQ29tZXJjaWFsIiA6ICJDT01JU0nDk04gRUpFQ1VUSVZBIEhJRFJPRUzDiUNUUklDQSBERUwgUsONTyBMRU1QQSIsCiAgICAidGlwb0VzdGFibGVjaW1pZW50byIgOiAiMDEiLAogICAgImRpcmVjY2lvbiIgOiB7CiAgICAgICJtdW5pY2lwaW8iIDogIjE0IiwKICAgICAgImNvbXBsZW1lbnRvIiA6ICI5wrAgQ0FMTEUgUE9OSUVOVEUgMTfCsCBBVi4gTk9SVEUsIENFTlRSTyBERSBHT0JJRVJOTywgIyA5NTAsIFNBTiBTQUxWQURPUiwgRUwgU0FMVkFET1IiLAogICAgICAiZGVwYXJ0YW1lbnRvIiA6ICIwNiIKICAgIH0sCiAgICAidGVsZWZvbm8iIDogIjIyMTE2MDAwIiwKICAgICJjb3JyZW8iIDogImluZm9AY2VsLmdvYi5zdiIKICB9LAogICJyZWNlcHRvciIgOiB7CiAgICAibml0IiA6ICIwNjE0MjQwMjk5MTA0NyIsCiAgICAibnJjIiA6ICIxMTM2MDI0IiwKICAgICJub21icmUiIDogIkVNUFJFU0EgVFJBTlNNSVNPUkEgREUgRUwgU0FMVkFET1IsIFMuQS4gREUgQy5WLiIsCiAgICAiY29kQWN0aXZpZGFkIiA6ICIzNTEwMiIsCiAgICAiZGVzY0FjdGl2aWRhZCIgOiAiVHJhbnNtaXNpw7NuIGRlIGVuZXJnw61hIGVsw6ljdHJpY2EiLAogICAgIm5vbWJyZUNvbWVyY2lhbCIgOiAiRVRFU0FMLCBTLkEuIERFIEMuVi4iLAogICAgImRpcmVjY2lvbiIgOiB7CiAgICAgICJtdW5pY2lwaW8iIDogIjEwIiwKICAgICAgImNvbXBsZW1lbnRvIiA6ICJDQUxMRSBQUklNQVZFUkEsIFJFUy4gUFJJTUFWRVJBLCAjIDExLCBTQU5UQSBURUNMQSwgTEEgTElCRVJUQUQiLAogICAgICAiZGVwYXJ0YW1lbnRvIiA6ICIwNSIKICAgIH0sCiAgICAidGVsZWZvbm8iIDogIjI1MDctNjYwMCIsCiAgICAiY29ycmVvIiA6ICJzaXNkdGVAY2VsLmdvYi5zdiIKICB9LAogICJjdWVycG9Eb2N1bWVudG8iIDogWyB7CiAgICAiY29kaWdvIiA6IG51bGwsCiAgICAibnVtSXRlbSIgOiAxLAogICAgImNhbnRpZGFkIiA6IDEsCiAgICAidGlwb0l0ZW0iIDogMywKICAgICJ0cmlidXRvcyIgOiBbICIyMCIgXSwKICAgICJwcmVjaW9VbmkiIDogMTE5NC4zOSwKICAgICJ1bmlNZWRpZGEiIDogNTksCiAgICAiY29kVHJpYnV0byIgOiBudWxsLAogICAgIm1vbnRvRGVzY3UiIDogMCwKICAgICJ2ZW50YU5vU3VqIiA6IDAsCiAgICAiZGVzY3JpcGNpb24iIDogIkFKVVNURSBBTCBTVU1JTklTVFJPIERFIEVORVJHSUEgRUxFQ1RSSUNBIEVOIFNVQkVTVEFDSU9ORVMgQ09SUkVTUE9ORElFTlRFIEFMIE1FUyBERSBKVU5JTyBERSAyMDIyIFBPUiA0MjEsNDc0LjY0MiBLV0ggU0VHVU4gTU9ESUZJQ0FDSU9OIE5PLiAxIEFMIENPTlRSQVRPIENFTC0zNjg4LVMgQVBMSUNBRE8gQUwgQ0NGIDE5MCBERUwgIDExMDcyMDIyIiwKICAgICJ2ZW50YUV4ZW50YSIgOiAwLAogICAgInZlbnRhR3JhdmFkYSIgOiAxMTk0LjM5LAogICAgIm51bWVyb0RvY3VtZW50byIgOiAiMTkwIgogIH0gXSwKICAicmVzdW1lbiIgOiB7CiAgICAiaXZhUmV0ZTEiIDogMCwKICAgICJzdWJUb3RhbCIgOiAxMTk0LjM5LAogICAgInRyaWJ1dG9zIiA6IFsgewogICAgICAiY29kaWdvIiA6ICIyMCIsCiAgICAgICJkZXNjcmlwY2lvbiIgOiAiSW1wdWVzdG8gYWwgVmFsb3IgQWdyZWdhZG8gMTMlIiwKICAgICAgInZhbG9yIiA6IDE1NS4yNwogICAgfSBdLAogICAgIml2YVBlcmNpMSIgOiAwLAogICAgInJldGVSZW50YSIgOiAwLAogICAgImRlc2N1Tm9TdWoiIDogMCwKICAgICJ0b3RhbERlc2N1IiA6IDAsCiAgICAidG90YWxOb1N1aiIgOiAwLAogICAgImRlc2N1RXhlbnRhIiA6IDAsCiAgICAidG90YWxFeGVudGEiIDogMCwKICAgICJ0b3RhbExldHJhcyIgOiAiVU4gTUlMIFRSRVNDSUVOVE9TIENVQVJFTlRBIFkgTlVFVkUgIETDk0xBUkVTIENPTiA2Ni8xMDAiLAogICAgImRlc2N1R3JhdmFkYSIgOiAwLAogICAgInRvdGFsR3JhdmFkYSIgOiAxMTk0LjM5LAogICAgInN1YlRvdGFsVmVudGFzIiA6IDExOTQuMzksCiAgICAiY29uZGljaW9uT3BlcmFjaW9uIiA6IDEsCiAgICAibW9udG9Ub3RhbE9wZXJhY2lvbiIgOiAxMzQ5LjY2CiAgfSwKICAidmVudGFUZXJjZXJvIiA6IG51bGwsCiAgImV4dGVuc2lvbiIgOiBudWxsLAogICJhcGVuZGljZSIgOiBudWxsCn0.bmbJ8CqeA7XgGlZ3SDXzAmWAvaegsp-NR2ziiSrMpzFjm4GVa_k8iX4Ysrf2EB954vZJPEBbpWpbR3U8WKyeBQs8pz8vPXUXVra2haC4JtE1xF3adtblheWe-CQdxQMH9IfWTA4DSGhVlXpJcRWOk5ziPFloFOsdfW_GGl38YAByNP3C0IjFpr0e2fPyDu_N_1Qm_U7TIoqoKyOTthuGlBsHM6yYRJNWKtBgxNHRVUWjjDOGzfbd-whfFYd5Fc00cXoAlFuzT2c41ybUypRGFYJi8viK4gCFvhGDEYJ87tuN-8JBUh3r5QvNRtrMClMIFTDI13mUq5kybrxsk-qxQg",
      selloRecibido: "2023E7C54C101E784BB6A45568E1F53C25183Z9W"
    }

    jsonDte_07 = 
    {
      identificacion: {
        fecEmi: "2023-09-20",
        horEmi: "08:28:11",
        tipoDte: "07",
        version: 1,
        ambiente: "00",
        tipoModelo: 1,
        tipoMoneda: "USD",
        motivoContin: null,
        numeroControl: "DTE-07-00000000-000000000000051",
        tipoOperacion: 1,
        codigoGeneracion: "05CC1957-F10C-6670-E064-00144FFB12D3",
        tipoContingencia: null
      },
      emisor: {
        nit: "06141809480014",
        nrc: "81981",
        nombre: "COMISIÓN EJECUTIVA HIDROELÉCTRICA DEL RÍO LEMPA",
        codActividad: "35101",
        descActividad: "Generación de energía eléctrica",
        nombreComercial: "COMISIÓN EJECUTIVA HIDROELÉCTRICA DEL RÍO LEMPA",
        tipoEstablecimiento: "01",
        direccion: {
          municipio: "14",
          complemento: "9° CALLE PONIENTE 17° AV. NORTE, CENTRO DE GOBIERNO, # 950, SAN SALVADOR, EL SALVADOR",
          departamento: "06"
        },
        telefono: "22116000",
        correo: "info@cel.gob.sv",
        codigoMH: null,
        codigo: null,
        puntoVentaMH: null,
        puntoVenta: null
      },
      receptor: {
        nit: "06142402912345",
        nrc: "1112345",
        nombre: "EMPRESA 12345",
        codActividad: "12345",
        descActividad: "Transmisión de 12345",
        nombreComercial: "12345 S.A. DE C.V.",
        direccion: {
          municipio: "10",
          complemento: "CALLE 12345, RES.12345, # 12345, SANTA TECLA, LA LIBERTAD",
          departamento: "05"
        },
        telefono: "2512-34560",
        correo: "sisdte@cel.gob.sv"
      },
      "cuerpoDocumento": [
        {
          numItem: 1,
          tipoDoc: 1,
          tipoDte: "14",
          descripcion: "AJUSTE AL SUMINISTRO DE ENERGIA ELECTRICA EN SUBESTACIONES CORRESPONDIENTE AL MES DE JUNIO DE 2022 POR 421,474.642 KWH SEGUN MODIFICACION NO. 1 AL CONTRATO CEL-3688-S APLICADO AL CCF 190 DEL  11072022",
          ivaRetenido: 57.78,
          fechaEmision: "2023-09-20",
          numDocumento: "2730",
          montoSujetoGrav: 444.44,
          codigoRetencionMH: "C4"
        }
      ],
      resumen: {
        totalSujetoRetencion: 444.44,
        totalIVAretenido: 57.78,
        totalIVAretenidoLetras: "CINCUENTA Y SIETE  DÓLARES CON 78/100"
      },
      extension: null,
      apendice: null,
      firmaElectronica: "eyJhbGciOiJSUzUxMiJ9.ewogICJpZGVudGlmaWNhY2lvbiIgOiB7CiAgICAiZmVjRW1pIiA6ICIyMDIzLTA5LTIwIiwKICAgICJob3JFbWkiIDogIjA4OjI4OjExIiwKICAgICJ0aXBvRHRlIiA6ICIwNyIsCiAgICAidmVyc2lvbiIgOiAxLAogICAgImFtYmllbnRlIiA6ICIwMCIsCiAgICAidGlwb01vZGVsbyIgOiAxLAogICAgInRpcG9Nb25lZGEiIDogIlVTRCIsCiAgICAibW90aXZvQ29udGluIiA6IG51bGwsCiAgICAibnVtZXJvQ29udHJvbCIgOiAiRFRFLTA3LTAwMDAwMDAwLTAwMDAwMDAwMDAwMDA1MSIsCiAgICAidGlwb09wZXJhY2lvbiIgOiAxLAogICAgImNvZGlnb0dlbmVyYWNpb24iIDogIjA1Q0MxOTU3LUYxMEMtNjY3MC1FMDY0LTAwMTQ0RkZCMTJEMyIsCiAgICAidGlwb0NvbnRpbmdlbmNpYSIgOiBudWxsCiAgfSwKICAiZW1pc29yIiA6IHsKICAgICJuaXQiIDogIjA2MTQxODA5NDgwMDE0IiwKICAgICJucmMiIDogIjgxOTgxIiwKICAgICJub21icmUiIDogIkNPTUlTScOTTiBFSkVDVVRJVkEgSElEUk9FTMOJQ1RSSUNBIERFTCBSw41PIExFTVBBIiwKICAgICJjb2RBY3RpdmlkYWQiIDogIjM1MTAxIiwKICAgICJkZXNjQWN0aXZpZGFkIiA6ICJHZW5lcmFjacOzbiBkZSBlbmVyZ8OtYSBlbMOpY3RyaWNhIiwKICAgICJub21icmVDb21lcmNpYWwiIDogIkNPTUlTScOTTiBFSkVDVVRJVkEgSElEUk9FTMOJQ1RSSUNBIERFTCBSw41PIExFTVBBIiwKICAgICJ0aXBvRXN0YWJsZWNpbWllbnRvIiA6ICIwMSIsCiAgICAiZGlyZWNjaW9uIiA6IHsKICAgICAgIm11bmljaXBpbyIgOiAiMTQiLAogICAgICAiY29tcGxlbWVudG8iIDogIjnCsCBDQUxMRSBQT05JRU5URSAxN8KwIEFWLiBOT1JURSwgQ0VOVFJPIERFIEdPQklFUk5PLCAjIDk1MCwgU0FOIFNBTFZBRE9SLCBFTCBTQUxWQURPUiIsCiAgICAgICJkZXBhcnRhbWVudG8iIDogIjA2IgogICAgfSwKICAgICJ0ZWxlZm9ubyIgOiAiMjIxMTYwMDAiLAogICAgImNvcnJlbyIgOiAiaW5mb0BjZWwuZ29iLnN2IiwKICAgICJjb2RpZ29NSCIgOiBudWxsLAogICAgImNvZGlnbyIgOiBudWxsLAogICAgInB1bnRvVmVudGFNSCIgOiBudWxsLAogICAgInB1bnRvVmVudGEiIDogbnVsbAogIH0sCiAgInJlY2VwdG9yIiA6IHsKICAgICJkaXJlY2Npb24iIDogeyB9CiAgfSwKICAiY3VlcnBvRG9jdW1lbnRvIiA6IFsgewogICAgIm51bUl0ZW0iIDogMSwKICAgICJ0aXBvRG9jIiA6IDEsCiAgICAidGlwb0R0ZSIgOiAiMTQiLAogICAgImRlc2NyaXBjaW9uIiA6IG51bGwsCiAgICAiaXZhUmV0ZW5pZG8iIDogNTcuNzgsCiAgICAiZmVjaGFFbWlzaW9uIiA6ICIyMDIzLTA5LTIwIiwKICAgICJudW1Eb2N1bWVudG8iIDogIjI3MzAiLAogICAgIm1vbnRvU3VqZXRvR3JhdiIgOiA0NDQuNDQsCiAgICAiY29kaWdvUmV0ZW5jaW9uTUgiIDogIkM0IgogIH0gXSwKICAicmVzdW1lbiIgOiB7CiAgICAidG90YWxTdWpldG9SZXRlbmNpb24iIDogNDQ0LjQ0LAogICAgInRvdGFsSVZBcmV0ZW5pZG8iIDogNTcuNzgsCiAgICAidG90YWxJVkFyZXRlbmlkb0xldHJhcyIgOiAiQ0lOQ1VFTlRBIFkgU0lFVEUgIETDk0xBUkVTIENPTiA3OC8xMDAiCiAgfSwKICAiZXh0ZW5zaW9uIiA6IG51bGwsCiAgImFwZW5kaWNlIiA6IG51bGwKfQ.V4SWOkZtEz9ePtvhkNYQiLgUl6tO9uvChmBM9m_yyt7mAMoXwRNOWYk4wJUpgkBR9jPkYsCkFgI1oqjsbsfaoHq6J3Om8jHQ1_0piMxXFcaH567-jDwoDPgtERPbQYxhaA-xp9IsOj_DOfIiE20YoncaNHEtxM0sY0T8xAYDmhbDKqzycLKt3kCt-PMCEdrdqRNojpl3VKls3GcKgB_KpXE0pcdoTdH8SMBmclyPKKFNzwWS4BNuNKyrhkXZMLCMikF52-di2UY0aoufLf_cvCJe1QL4NsvKC6S6jL5Yjcjf2bVVaB_-Vm4xkFp4rgc920hpqbCr5GITfU9JeWy-cA",
      selloRecibido: "2023E7C54C101E784BB6A45568E1F53C25183123"
    }

    this.genera_documento_cel(jsonDte_05);
    return 'Proceso Finalizado';
  }


  public async genera_documento_cel(dte: any): Promise<void> {
    const serverUrl = this.appContextService.getServerUrl();
    console.log('URL: ' + serverUrl);
    const puppeteer = require('puppeteer');
    const fs = require('fs-extra');
    const hbs = require('handlebars');
    const path = require('path');
    const qr = require('qrcode');
    const { format } = require('date-fns');
    const data = dte;

    // Fecha y hora actual
    const moment_hora = require('moment');
    let currentDate = moment_hora().format('DD/MM/YYYY');
    let currentTime = moment_hora().format('hh:mm:ss');
    const Fecha_hora = currentDate + '   ' + currentTime;

    // FORMATO MONEDA UTILIZADO DENTRO DE LA PLANTILLA HBS
    // Se establece  minimumFractionDigits y maximumFractionDigits en 2 para mostrar exactamente 2 decimales. 
    hbs.registerHelper('formatNumber_Moneda', function (number) {
      // Aplica el formato de número deseado
      const formattedNumber = number !== null && number !== undefined ? number.toLocaleString('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }) : '';
      return formattedNumber;
    });

    // FORMATO NÚMERO UTILIZADO DENTRO DE LA PLANTILLA HBS
    // Se establece  minimumFractionDigits y maximumFractionDigits en 2 para mostrar exactamente 2 decimales. 
    hbs.registerHelper('formatNumber_Cantidad', function (number) {
      // Aplica el formato de número deseado
      const formattedNumber = number !== null && number !== undefined ? number.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }) : '';
      return formattedNumber;
    });

    //VALIDA SI LA VARIABLE DEL JSON EXISTE O NO
    hbs.registerHelper('isDefined', function (value) {
      return value !== undefined;
    });

    hbs.registerHelper('formatDate', function (date) {
      const fechaObjeto = new Date(date);
      const dia = fechaObjeto.getDate().toString().padStart(2, '0');
      const mes = (fechaObjeto.getMonth() + 1).toString().padStart(2, '0');
      const anio = fechaObjeto.getFullYear().toString();

      const fechaFormateada = `${dia}/${mes}/${anio}`;
      return fechaFormateada;
    });

    hbs.registerHelper('isEqual', function (value1, value2, options) {
      if (value1 === value2) {
        return options.fn(this);
      } else {
        return options.inverse(this);
      }
    });

    hbs.registerHelper('existe', function (value1, value2, options) {
      if (value1 === value2 || value1 !== undefined) {
        return options.fn(this);
      }
      return options.inverse(this);
    });

    // FORMATO MONEDA UTILIZADO EN EL SERVICIO
    function formatCurrency(amount, locale, currency, decimalDigits) {
      if (amount === null || amount === undefined) {
        return ''; // Devuelve una cadena vacía si el valor es nulo o indefinido
      }

      return amount.toLocaleString(locale, {
        style: 'currency',
        currency: currency,
        currencyDisplay: 'symbol',
        minimumFractionDigits: decimalDigits,
        maximumFractionDigits: decimalDigits
      });
    }

    function formatearFecha_01(fecha) {
      const fechaObjeto = new Date(fecha);
      const dia = fechaObjeto.getDate().toString().padStart(2, '0');
      const mes = (fechaObjeto.getMonth() + 1).toString().padStart(2, '0');
      const anio = fechaObjeto.getFullYear().toString();
      const horas = fechaObjeto.getHours().toString().padStart(2, '0');
      const minutos = fechaObjeto.getMinutes().toString().padStart(2, '0');
      const segundos = fechaObjeto.getSeconds().toString().padStart(2, '0');

      const fechaFormateada = `${dia}/${mes}/${anio} ${horas}:${minutos}:${segundos}`;
      return fechaFormateada;
    }

    function formatearFecha_02(fecha) {
      const fechaObjeto = new Date(fecha);
      const dia = fechaObjeto.getDate().toString().padStart(2, '0');
      const mes = (fechaObjeto.getMonth() + 1).toString().padStart(2, '0');
      const anio = fechaObjeto.getFullYear().toString();

      const fechaFormateada = `${dia}/${mes}/${anio}`;
      return fechaFormateada;
    }

    // Obtener los valores necesarios del archivo JSON
    const ide_TDT = data.identificacion.tipoDte;
    const ide_CGE = data.identificacion.codigoGeneracion;
    const ide_NCO = data.identificacion.numeroControl;
    const ide_FEC = data.identificacion.fecEmi;
    const rec_NOM = data.receptor.nombre;
    const nombre_archivo = `${ide_CGE}`;

    /////////////////////////////////////////////////
    //---- SELECCIÓN DE PLANTILLA 
    /////////////////////////////////////////////////
    let v_plantilla = ``;

    if (ide_TDT == '01') {
      v_plantilla = 'cel_documento_01';
    }
    else if (ide_TDT == '03') {
      v_plantilla = 'cel_documento_01';
    }
    else if (ide_TDT == '05') {
      v_plantilla = 'cel_documento_01';
    }
    else if (ide_TDT == '06') {
      v_plantilla = 'cel_documento_01';
    }
    else if (ide_TDT == '07') {
      v_plantilla = 'cel_documento_02';
    }

    //DEFINO NOMBRE DEL ARCHIVO PDF
    const filePdfDocumento = join(__dirname, '..', '..', 'public', `${nombre_archivo}.pdf`);
    //DEFINO NOMBRE DEL ARCHIVO (PNG) CON CÓDIGO QR
    const fileQr = join(__dirname, '..', '..', 'public', `${nombre_archivo}.png`);
    //FUNCIÓN QUE COMPILA LA PLANTILLA HBS
    const compile = async function (templateName, datos) {
      const filePath = path.join(process.cwd(), 'templates', `${templateName}.hbs`);
      const html = await fs.readFile(filePath, 'utf-8');
      return hbs.compile(html)(datos);
    };


    const jsonString = JSON.stringify(dte, null, 2);
    const fileJsonDocumentoNew = join(__dirname, '..', '..', 'public', `${nombre_archivo}` + '.json');
    fs.writeFileSync(fileJsonDocumentoNew, jsonString, 'utf8');

    //////////////////////////////////////
    await generaQr();
    console.log('QR generado');
    //////////////////////////////////////
    await generaPdf(ide_TDT, v_plantilla);
    console.log('PDF generado');
    //////////////////////////////////////
    await this.envioCorreo(ide_CGE, ide_NCO, rec_NOM, fileJsonDocumentoNew, filePdfDocumento, fileQr);
    console.log('Correlo Electrónico Enviado');
    //////////////////////////////////////
    console.log('Proceso Finalizado');
    //////////////////////////////////////


    //////////////////////////////////////
    // FUNCIÓN PARA GENERAR ARCHIVO PDF //
    //////////////////////////////////////
    async function generaPdf(ideTDT: any, v_plantilla: any) {
      try {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();


        // Variables fijas
        const fixedVariables = {
          codigo_qr: `${nombre_archivo}.png`,
          url: `${serverUrl}/static/`,
        };
        // Combinar los datos del archivo JSON con las variables fijas
        const fixedPlusJson = { ...dte, ...fixedVariables };


        //console.log(datosJson);
        const content = await compile(v_plantilla, fixedPlusJson);

        // Definir el contenido del encabezado y el pie de página como plantillas HTML
        const v_headerTemplate = ``;

        const v_footerTemplate =
          `
            <table width="100%" border="0">
              <tbody>
                <tr>
                  <td style="width: 50%; text-align: left; padding-left: 0.5em; font-size: small; font-family: 'Open Sans', sans-serif; padding-left: 0.5em">
                    <div style="font-size: 7px;">&nbsp;&nbsp;&nbsp;Fecha y hora actual:  `+ `${Fecha_hora}` + `</div>
                  </td>
                  <td style="width: 50%; text-align: right; padding-right: 0.5em; font-size: small; font-family: 'Open Sans', sans-serif; padding-right: 0.5em">
                    <div style="font-size: 7px;">Página <span class="pageNumber"></span> de <span class="totalPages"></span>&nbsp;&nbsp;&nbsp;</div>
                  </td>
                </tr>
              </tbody>
            </table>
          `;


        await page.setContent(content);
        await page.emulateMediaType('screen');
        // Agregar estilos CSS para el encabezado y pie de página
        await page.addStyleTag({
          content: `
            @page {
              size: A4;
              margin-top: 0px;
              margin-bottom: 40px;
            }
          `
        });
        await page.pdf({
          path: filePdfDocumento,
          format: 'A4',
          printBackground: true,
          displayHeaderFooter: true,
          headerTemplate: v_headerTemplate,//`<div style="font-size: 10px">CEL</div>`,
          footerTemplate: v_footerTemplate,//`<div style="font-size: 10px"><span class="pageNumber"></span> / <span class="totalPages"></span></div>`,
        });

        await browser.close();
        //process.exit();
      } catch (e) {
        console.log('our errpr', e);
      }
    };

    /////////////////////////////////////
    // FUNCIÓN PARA GENERAR ARCHIVO QR //
    /////////////////////////////////////
    async function generaQr() {
      //Codigo QR
      //const urlMh01 = 'https://webapp.dtes.mh.gob.sv/consultaPublica?ambiente=01&codGen=';
      const urlMh01 = 'https://admin.factura.gob.sv/consultaPublica?ambiente=00&codGen=';
      const urlMh02 = ide_CGE;
      const urlMh03 = '&fechaEmi=';
      const urlMh04 = ide_FEC;

      // URL para generar el código QR
      //const url = 'https://www.youtube.com/';
      //const url = 'https://webapp.dtes.mh.gob.sv/consultaPublica?ambiente=01&codGen=28576AF5-EB91-4BB6-9FEE-753D0936ACFF&fechaEmi=2023-08-28';

      const url = urlMh01 + urlMh02 + urlMh03 + urlMh04;

      qr.toFile(fileQr, url, function (err, code) {
        if (err) {
          return console.log('error');
        }
        {
          console.log('Código QR generado correctamente.');
        }

      });
    }



  }



  public async envioCorreo(ide_CGE: any, ide_NCO: any, rec_NOM: any, fileJsonDocumentoNew: any, filePdfDocumento: any, fileQr: any): (Promise<void>) {
    const serverUrl = this.appContextService.getServerUrl();

    this.mailerService
      .sendMail({
        //to: ['henavarro@cel.gob.sv'],
        to: ['calfaro@cel.gob.sv'],
        from: 'calfaro@cel.gob.sv',
        subject: 'Factura Electrónica - CEL',
        // text: 'Bienvenido', // plaintext body
        //html: '<h1>Bienvenido</h1>',
        template: 'cel_correo_ccf',
        //template: 'cel_correo_01',
        context: {
          url: `${serverUrl}/static/`,
          name: 'Cesar Alfaro',
          asunto: '',
          codgen: ide_CGE,
          numcon: ide_NCO,
          nomrec: rec_NOM,
          //people: ['Yehuda Katz', 'Alan Johnson', 'Charles Jolley'],
        },
        attachments: [
          {
            path: fileJsonDocumentoNew,
            contentType: 'application/json',
            filename: fileJsonDocumentoNew,
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


}
