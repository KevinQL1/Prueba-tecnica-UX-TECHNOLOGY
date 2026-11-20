import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

// Representa la tabla principal de órdenes de servicio en MySQL.
@Entity('ordenes_servicio')
export class OrdenServicio {
  // Identificador único autoincremental de la orden.
  @PrimaryGeneratedColumn()
  id: number;

  // Código único de referencia de la orden.
  @Column({ type: 'varchar', length: 30, unique: true })
  codigo_orden: string;

  // Nombre completo o razón social del cliente.
  @Column({ type: 'varchar', length: 150 })
  cliente_nombre: string;

  // Cantidad de servicios o productos solicitados.
  @Column({ type: 'int', default: 1 })
  cantidad_items: number;

  // Valor monetario total con dos posiciones decimales.
  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  valor_total: number;

  // Porcentaje de descuento permitido entre 0 y 100.
  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  porcentaje_descuento: number;

  // Fecha de registro o programación de la orden.
  @Column({ type: 'date' })
  fecha_solicitud: string;

  // Estado actual de la orden.
  @Column({ type: 'varchar', length: 20, default: 'Pendiente' })
  estado: string;

  // Nivel de prioridad de la orden.
  @Column({ type: 'varchar', length: 20, default: 'Media' })
  prioridad: string;

  // Observaciones adicionales, campo opcional.
  @Column({ type: 'text', nullable: true })
  observaciones: string | null;

  // Indica si la orden está activa o fue eliminada lógicamente.
  @Column({ type: 'tinyint', default: 1 })
  activo: boolean;

  // Fecha y hora de creación automática del registro.
  @CreateDateColumn({ type: 'timestamp' })
  fecha_creacion: Date;

  // Fecha y hora de la última actualización del registro.
  @UpdateDateColumn({ type: 'timestamp', nullable: true })
  fecha_actualizacion: Date | null;
}
