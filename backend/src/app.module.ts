import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { OrdenesModule } from './modules/ordenes/ordenes.module';

// Registra los componentes principales de la aplicación.
@Module({
  imports: [
    // Carga las variables de entorno desde el archivo .env de la raíz.
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '../.env',
    }),

    // Configura la conexión a MySQL utilizando las variables de entorno.
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_ROOT_PASSWORD'),
        database: configService.get<string>('DB_DATABASE'),

        // Define la codificación para soportar caracteres especiales.
        charset: 'utf8mb4',

        // Sincronizaremos las entidades manualmente mediante SQL.
        synchronize: false,

        // Carga automáticamente las entidades registradas en los módulos.
        autoLoadEntities: true,
      }),
    }),

    // Registra el módulo encargado de gestionar las órdenes.
    OrdenesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
