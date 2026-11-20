
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

// Inicializa la aplicación y configura el servidor HTTP.
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Agrupa todos los endpoints bajo el prefijo /api.
  app.setGlobalPrefix('api');

  // Activa las validaciones de los DTO para todas las peticiones.
  app.useGlobalPipes(
    new ValidationPipe({
      // Convierte los parámetros recibidos al tipo definido en cada DTO.
      transform: true,

      // Elimina propiedades que no estén definidas en el DTO.
      whitelist: true,

      // Rechaza las peticiones que incluyan propiedades no permitidas.
      forbidNonWhitelisted: true,
    }),
  );

  // Define la información general que aparecerá en Swagger.
  const swaggerConfig = new DocumentBuilder()
    .setTitle('API - Órdenes de Servicio')
    .setDescription('Documentación de la API para gestionar órdenes de servicio.')
    .setVersion('1.0.0')
    .addTag('Órdenes')
    .build();

     // Genera el documento OpenAPI a partir de los controladores y DTO.
  const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig);

  // Publica la documentación en /api/docs.
  SwaggerModule.setup('docs', app, swaggerDocument, {
  useGlobalPrefix: true,
  });

  // Inicia el servidor utilizando el puerto configurado o el 3000 por defecto.
  await app.listen(process.env.PORT ?? 3000);
}

void bootstrap();
