
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
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

  // Inicia el servidor utilizando el puerto configurado o el 3000 por defecto.
  await app.listen(process.env.PORT ?? 3000);
}

void bootstrap();
