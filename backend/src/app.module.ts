
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { OrdenesModule } from './modules/ordenes/ordenes.module';

// Registra los componentes principales de la aplicación.
@Module({
  controllers: [AppController],
  providers: [AppService],
  imports: [OrdenesModule],
})
export class AppModule {}
