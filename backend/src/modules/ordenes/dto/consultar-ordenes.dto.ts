
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
import { ESTADOS_ORDEN } from './crear-orden.dto';

// Define los parámetros permitidos para consultar y filtrar órdenes.
export class ConsultarOrdenesDto {
  // Indica la página que queremos consultar. Por defecto comienza en 1.
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page: number = 1;

  // Limita la cantidad de órdenes por página. Por defecto muestra 10.
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit: number = 10;

  // Permite buscar órdenes por el nombre del cliente.
  @IsOptional()
  @IsString()
  @MaxLength(150)
  cliente_nombre?: string;

  // Permite consultar órdenes por uno de los estados permitidos.
  @IsOptional()
  @IsIn(ESTADOS_ORDEN)
  estado?: string;
}
