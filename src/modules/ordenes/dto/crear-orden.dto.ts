
import {
  IsDateString,
  IsIn,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
} from 'class-validator';

// Define los estados permitidos para una orden de servicio.
export const ESTADOS_ORDEN = [
  'Pendiente',
  'En Proceso',
  'Completada',
  'Cancelada',
];

// Define los niveles de prioridad permitidos.
export const PRIORIDADES_ORDEN = [
  'Baja',
  'Media',
  'Alta',
  'Crítica',
];

// Define y valida la información necesaria para crear una orden.
export class CrearOrdenDto {
  // El código identifica de manera única cada orden.
  @IsString()
  @IsNotEmpty()
  @MaxLength(30)
  codigo_orden: string;

  // El nombre del cliente es obligatorio y admite hasta 150 caracteres.
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  cliente_nombre: string;

  // La cantidad debe ser un número entero igual o mayor que uno.
  @IsInt()
  @Min(1)
  cantidad_items: number;

  // El valor total debe ser numérico y no puede ser negativo.
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  valor_total: number;

  // El descuento debe estar entre 0 y 100.
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @Max(100)
  porcentaje_descuento: number;

  // La fecha debe tener un formato de fecha válido.
  @IsDateString()
  fecha_solicitud: string;

  // Solo se aceptan los estados definidos para las órdenes.
  @IsIn(ESTADOS_ORDEN)
  estado: string;

  // Solo se aceptan las prioridades definidas para las órdenes.
  @IsIn(PRIORIDADES_ORDEN)
  prioridad: string;

  // Las observaciones son opcionales y deben ser texto.
  @IsOptional()
  @IsString()
  observaciones?: string;
}
