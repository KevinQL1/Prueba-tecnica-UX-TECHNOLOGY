import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from '#src/app.module';

// Inicializa la aplicación y configura el servidor HTTP.
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Obtiene las variables de configuración de la aplicación.
  const configService = app.get(ConfigService);

  // Obtiene el puerto configurado para el frontend.
  const frontendPort = configService.getOrThrow<string>('FRONTEND_PORT')

  // Habilita las peticiones desde el frontend configurado.
  app.enableCors({
    origin: `http://localhost:${frontendPort}`,
  })

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

  // Inicia el servidor utilizando el puerto configurado.
  const port = Number(configService.getOrThrow<string>('API_PORT'));

  // Inicia el servidor HTTP.
  await app.listen(port);

}

void bootstrap();
