import { Module } from '@nestjs/common';
import { OrdenesController } from './ordenes.controller';
import { OrdenesService } from './ordenes.service';

// Registra el controlador y el servicio del módulo de órdenes.
@Module({
  controllers: [OrdenesController],
  providers: [OrdenesService]
})
export class OrdenesModule {}
