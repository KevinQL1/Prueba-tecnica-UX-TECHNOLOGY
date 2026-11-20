
import { PartialType } from '@nestjs/mapped-types';
import { CrearOrdenDto } from './crear-orden.dto';

// Convierte todos los campos del DTO de creación en opcionales.
// Así podemos actualizar únicamente los campos que necesitemos.
export class ActualizarOrdenDto extends PartialType(CrearOrdenDto) {}
