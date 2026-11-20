
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
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

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
  @ApiProperty({
    description: 'Código único de referencia de la orden.',
    example: 'ORD-2026-001',
    maxLength: 30,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(30)
  codigo_orden: string;

  // El nombre del cliente es obligatorio y admite hasta 150 caracteres.
  @ApiProperty({
    description: 'Nombre completo o razón social del cliente.',
    example: 'Grupo Réditos S.A.',
    maxLength: 150,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  cliente_nombre: string;

  // La cantidad debe ser un número entero igual o mayor que uno.
  @ApiProperty({
    description: 'Cantidad de ítems o servicios solicitados.',
    example: 5,
    minimum: 1,
  })
  @IsInt()
  @Min(1)
  cantidad_items: number;

  // El valor total debe ser numérico y no puede ser negativo.
  @ApiProperty({
    description: 'Valor monetario total de la orden.',
    example: 2500000.00,
    minimum: 0,
  })
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  valor_total: number;

  // El descuento debe estar entre 0 y 100.
  @ApiProperty({
    description: 'Porcentaje de descuento aplicado a la orden.',
    example: 10.00,
    minimum: 0,
    maximum: 100,
  })
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @Max(100)
  porcentaje_descuento: number;

  // La fecha debe tener un formato de fecha válido.
  @ApiProperty({
    description: 'Fecha de solicitud de la orden en formato YYYY-MM-DD.',
    example: '2026-11-19',
    format: 'date',
  })
  @IsDateString()
  fecha_solicitud: string;

  // Solo se aceptan los estados definidos para las órdenes.
  @ApiProperty({
    description: 'Estado actual de la orden.',
    enum: ESTADOS_ORDEN,
    example: 'Pendiente',
  })
  @IsIn(ESTADOS_ORDEN)
  estado: string;

  // Solo se aceptan las prioridades definidas para las órdenes.
  @ApiProperty({
    description: 'Nivel de prioridad de la orden.',
    enum: PRIORIDADES_ORDEN,
    example: 'Alta',
  })
  @IsIn(PRIORIDADES_ORDEN)
  prioridad: string;

  // Las observaciones son opcionales y deben ser texto.
  @ApiPropertyOptional({
    description: 'Notas o comentarios adicionales de la orden.',
    example: 'Implementación módulo transaccional',
  })
  @IsOptional()
  @IsString()
  observaciones?: string;
}
