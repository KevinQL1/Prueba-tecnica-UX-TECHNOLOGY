import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrdenServicio } from './entities/orden-servicio.entity';
import { OrdenesController } from './ordenes.controller';
import { OrdenesService } from './ordenes.service';

// Registra el controlador y el servicio del módulo de órdenes.
@Module({
  imports: [
    // Registra el repositorio de la entidad para utilizarlo en el servicio.
    TypeOrmModule.forFeature([OrdenServicio]),
  ],
  controllers: [OrdenesController],
  providers: [OrdenesService]
})
export class OrdenesModule {}
