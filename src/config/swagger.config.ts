/* eslint-disable prettier/prettier */
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export function setupSwagger(app) {
    const config = new DocumentBuilder()
    .setTitle('Pasarela de Transmisión DTE CALFARO')
    .setTermsOfService('https://www.ejemploenergia.com/terminos-y-condiciones')
    .setDescription(
      'API para la transmisión de documentos tributarios electrónicos de CEL',
    )
    .setVersion('1.0')
    .addTag('DTE')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  // Configuración personalizada de Swagger UI
  const options = {
    customCss: `.swagger-ui .topbar { background-color: #0e2240; }  
      .swagger-ui .topbar .download-url-wrapper input[type=text] {border: none;} 
      .swagger-ui .topbar .download-url-wrapper .download-url-button {  background: #5c6f8b;}
      .swagger-ui .topbar-wrapper img {
        content: url('../static/logo-text-on-dark.svg');
        width: 100px; /* Personaliza el ancho de la imagen según tus necesidades */
        height: auto; /* Ajusta la altura automáticamente según el ancho */
      }
      `,

    customSiteTitle: 'Pasarela de Transmisión DTE', // Cambiar el título del sitio
    explorer: true, // Mostrar el explorador de la API
    customfavIcon: 'static/favicon-32x32.png',
  };
  SwaggerModule.setup('api-dte/docs', app, document, options);

}
