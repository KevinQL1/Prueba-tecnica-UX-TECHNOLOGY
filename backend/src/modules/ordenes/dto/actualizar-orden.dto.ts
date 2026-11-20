
import { PartialType } from '@nestjs/mapped-types';
import { CrearOrdenDto } from '#src/modules/ordenes/dto/crear-orden.dto';

// Hereda los campos y ejemplos de CrearOrdenDto.
// PartialType convierte todas las propiedades en opcionales
// y Swagger las documenta como campos no obligatorios.
export class ActualizarOrdenDto extends PartialType(CrearOrdenDto) {}
