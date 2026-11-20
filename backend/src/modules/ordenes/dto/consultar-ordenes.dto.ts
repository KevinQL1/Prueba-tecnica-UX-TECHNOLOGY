
import { Type } from 'class-transformer';
import {
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { ESTADOS_ORDEN } from '#src/modules/ordenes/dto/crear-orden.dto';

// Define los parámetros permitidos para consultar y filtrar órdenes.
export class ConsultarOrdenesDto {
  // Indica la página que queremos consultar. Por defecto comienza en 1.
  @ApiPropertyOptional({
    description: 'Número de página que se desea consultar.',
    example: 1,
    default: 1,
    minimum: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page: number = 1;

  // Limita la cantidad de órdenes por página. Por defecto muestra 10.
  @ApiPropertyOptional({
    description: 'Cantidad de órdenes por página. Máximo permitido: 100.',
    example: 10,
    default: 10,
    minimum: 1,
    maximum: 100,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit: number = 10;

  // Permite buscar órdenes por el nombre del cliente.
  @ApiPropertyOptional({
    description: 'Filtra las órdenes por el nombre del cliente.',
    example: 'Carlos Pérez',
    maxLength: 150,
  })
  @IsOptional()
  @IsString()
  @MaxLength(150)
  cliente_nombre?: string;

  // Permite consultar órdenes por uno de los estados permitidos.
  @ApiPropertyOptional({
    description: 'Filtra las órdenes por su estado actual.',
    enum: ESTADOS_ORDEN,
    example: 'Pendiente',
  })
  @IsOptional()
  @IsIn(ESTADOS_ORDEN)
  estado?: string;
}
