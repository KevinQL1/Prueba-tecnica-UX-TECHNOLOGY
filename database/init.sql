
-- Configura la conexión para soportar correctamente caracteres especiales.
SET NAMES utf8mb4;

-- Crea la base de datos utilizando caracteres compatibles con español.
CREATE DATABASE IF NOT EXISTS ux_prueba_tecnica
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

-- Selecciona la base de datos de la aplicación.
USE ux_prueba_tecnica;

-- Crea la tabla principal de órdenes de servicio.
CREATE TABLE IF NOT EXISTS ordenes_servicio (
    -- Identificador único de cada orden.
    id INT AUTO_INCREMENT PRIMARY KEY,

    -- Código único de referencia de la orden.
    codigo_orden VARCHAR(30) NOT NULL UNIQUE,

    -- Nombre del cliente solicitante.
    cliente_nombre VARCHAR(150) NOT NULL,

    -- Cantidad de servicios o productos solicitados.
    cantidad_items INT NOT NULL DEFAULT 1,

    -- Valor monetario con dos decimales.
    valor_total DECIMAL(12, 2) NOT NULL DEFAULT 0.00,

    -- Descuento permitido entre 0 y 100.
    porcentaje_descuento DECIMAL(5, 2) NOT NULL DEFAULT 0.00,

    -- Fecha de solicitud de la orden.
    fecha_solicitud DATE NOT NULL,

    -- Estado actual de la orden.
    estado VARCHAR(20) NOT NULL DEFAULT 'Pendiente',

    -- Prioridad asignada a la orden.
    prioridad VARCHAR(20) NOT NULL DEFAULT 'Media',

    -- Comentarios adicionales opcionales.
    observaciones TEXT NULL,

    -- Control de borrado lógico.
    activo TINYINT(1) NOT NULL DEFAULT 1,

    -- Fecha automática de creación.
    fecha_creacion TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    -- Fecha automática de última actualización.
    fecha_actualizacion TIMESTAMP NULL DEFAULT NULL
        ON UPDATE CURRENT_TIMESTAMP,

    -- Validación de cantidad mínima.
    CONSTRAINT chk_cantidad_items
        CHECK (cantidad_items >= 1),

    -- Validación del valor monetario.
    CONSTRAINT chk_valor_total
        CHECK (valor_total >= 0),

    -- Validación del porcentaje de descuento.
    CONSTRAINT chk_porcentaje_descuento
        CHECK (porcentaje_descuento BETWEEN 0 AND 100),

    -- Validación de los estados permitidos.
    CONSTRAINT chk_estado
        CHECK (estado IN (
            'Pendiente',
            'En Proceso',
            'Completada',
            'Cancelada'
        )),

    -- Validación de las prioridades permitidas.
    CONSTRAINT chk_prioridad
        CHECK (prioridad IN (
            'Baja',
            'Media',
            'Alta',
            'Crítica'
        ))
) ENGINE=InnoDB
  DEFAULT CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

-- Inserta los dos registros de ejemplo de la prueba técnica.
INSERT INTO ordenes_servicio (
    codigo_orden,
    cliente_nombre,
    cantidad_items,
    valor_total,
    porcentaje_descuento,
    fecha_solicitud,
    estado,
    prioridad,
    observaciones
) VALUES
(
    'ORD-2026-001',
    'Grupo Réditos S.A.',
    5,
    2500000.00,
    10.00,
    '2026-11-15',
    'En Proceso',
    'Alta',
    'Implementación módulo transaccional'
),
(
    'ORD-2026-002',
    'Kevin Quintero',
    2,
    850500.50,
    0.00,
    '2026-11-18',
    'Pendiente',
    'Media',
    'Soporte preventivo de terminales'
);
