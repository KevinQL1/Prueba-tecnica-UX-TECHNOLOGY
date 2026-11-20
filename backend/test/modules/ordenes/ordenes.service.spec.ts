
import {
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { OrdenesService } from '../../../src/modules/ordenes/ordenes.service';
import { OrdenServicio } from '../../../src/modules/ordenes/entities/orden-servicio.entity';
import { CrearOrdenDto } from '../../../src/modules/ordenes/dto/crear-orden.dto';
import { ActualizarOrdenDto } from '../../../src/modules/ordenes/dto/actualizar-orden.dto';
import { ConsultarOrdenesDto } from '../../../src/modules/ordenes/dto/consultar-ordenes.dto';

describe('OrdenesService', () => {
  let servicio: OrdenesService;

  // Simula los métodos del repositorio de TypeORM.
  let repositorio: {
    createQueryBuilder: jest.Mock;
    findOne: jest.Mock;
    create: jest.Mock;
    save: jest.Mock;
  };

  // Simula la consulta encadenada que utiliza TypeORM.
  let consulta: {
    where: jest.Mock;
    andWhere: jest.Mock;
    orderBy: jest.Mock;
    skip: jest.Mock;
    take: jest.Mock;
    getManyAndCount: jest.Mock;
  };

  // Representa una orden de servicio para las pruebas.
  const ordenEjemplo = {
    id: 1,
    codigo_orden: 'ORD-001',
    cliente_nombre: 'Cliente de prueba',
    cantidad_items: 2,
    valor_total: 150000,
    porcentaje_descuento: 10,
    fecha_solicitud: '2026-11-19',
    estado: 'Pendiente',
    prioridad: 'Alta',
    observaciones: null,
    activo: true,
  } as unknown as OrdenServicio;

  beforeEach(() => {
    // Configura los métodos encadenables del QueryBuilder.
    consulta = {
      where: jest.fn().mockReturnThis(),
      andWhere: jest.fn().mockReturnThis(),
      orderBy: jest.fn().mockReturnThis(),
      skip: jest.fn().mockReturnThis(),
      take: jest.fn().mockReturnThis(),
      getManyAndCount: jest.fn(),
    };

    // Configura el repositorio simulado.
    repositorio = {
      createQueryBuilder: jest.fn().mockReturnValue(consulta),
      findOne: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
    };

    // Inyecta el repositorio simulado en el servicio.
    servicio = new OrdenesService(
      repositorio as unknown as Repository<OrdenServicio>,
    );
  });

  describe('consultarTodas', () => {
    it('debe consultar las órdenes activas con paginación', async () => {
      const filtros = {
        page: 1,
        limit: 10,
      } as ConsultarOrdenesDto;

      consulta.getManyAndCount.mockResolvedValue([
        [ordenEjemplo],
        1,
      ]);

      const resultado = await servicio.consultarTodas(filtros);

      expect(repositorio.createQueryBuilder).toHaveBeenCalledWith('orden');
      expect(consulta.where).toHaveBeenCalledWith(
        'orden.activo = :activo',
        { activo: 1 },
      );
      expect(consulta.skip).toHaveBeenCalledWith(0);
      expect(consulta.take).toHaveBeenCalledWith(10);
      expect(resultado).toEqual({
        data: [ordenEjemplo],
        pagination: {
          total: 1,
          page: 1,
          limit: 10,
          totalPages: 1,
        },
      });
    });

    it('debe aplicar los filtros por cliente y estado', async () => {
      const filtros = {
        page: 2,
        limit: 5,
        cliente_nombre: 'Kevin',
        estado: 'Pendiente',
      } as ConsultarOrdenesDto;

      consulta.getManyAndCount.mockResolvedValue([[], 0]);

      await servicio.consultarTodas(filtros);

      expect(consulta.andWhere).toHaveBeenCalledWith(
        'orden.cliente_nombre LIKE :cliente',
        { cliente: '%Kevin%' },
      );
      expect(consulta.andWhere).toHaveBeenCalledWith(
        'orden.estado = :estado',
        { estado: 'Pendiente' },
      );
      expect(consulta.skip).toHaveBeenCalledWith(5);
      expect(consulta.take).toHaveBeenCalledWith(5);
    });
  });

  describe('consultarPorId', () => {
    it('debe retornar una orden cuando existe y está activa', async () => {
      repositorio.findOne.mockResolvedValue(ordenEjemplo);

      const resultado = await servicio.consultarPorId(1);

      expect(repositorio.findOne).toHaveBeenCalledWith({
        where: {
          id: 1,
          activo: true,
        },
      });
      expect(resultado).toEqual(ordenEjemplo);
    });

    it('debe lanzar NotFoundException cuando la orden no existe', async () => {
      repositorio.findOne.mockResolvedValue(null);

      await expect(servicio.consultarPorId(99)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('crear', () => {
    it('debe crear y guardar una nueva orden', async () => {
      const dto = {
        codigo_orden: 'ORD-002',
        cliente_nombre: 'Nuevo cliente',
        cantidad_items: 3,
        valor_total: 200000,
        porcentaje_descuento: 5,
        fecha_solicitud: '2026-11-19',
        estado: 'Pendiente',
        prioridad: 'Media',
      } as CrearOrdenDto;

      repositorio.findOne.mockResolvedValue(null);
      repositorio.create.mockReturnValue({
        ...dto,
        activo: true,
      });
      repositorio.save.mockResolvedValue({
        ...dto,
        activo: true,
        id: 2,
      });

      const resultado = await servicio.crear(dto);

      expect(repositorio.findOne).toHaveBeenCalledWith({
        where: { codigo_orden: dto.codigo_orden },
      });
      expect(repositorio.create).toHaveBeenCalledWith({
        ...dto,
        activo: true,
      });
      expect(repositorio.save).toHaveBeenCalled();
      expect(resultado).toEqual(
        expect.objectContaining({
          codigo_orden: 'ORD-002',
          activo: true,
        }),
      );
    });

    it('debe lanzar ConflictException cuando el código ya existe', async () => {
      const dto = {
        codigo_orden: 'ORD-001',
      } as CrearOrdenDto;

      repositorio.findOne.mockResolvedValue(ordenEjemplo);

      await expect(servicio.crear(dto)).rejects.toThrow(
        ConflictException,
      );

      expect(repositorio.save).not.toHaveBeenCalled();
    });
  });

  describe('actualizar', () => {
    it('debe actualizar una orden existente', async () => {
      const dto = {
        cliente_nombre: 'Cliente actualizado',
      } as ActualizarOrdenDto;

      repositorio.findOne.mockResolvedValue(ordenEjemplo);
      repositorio.save.mockImplementation(async (orden) => orden);

      const resultado = await servicio.actualizar(1, dto);

      expect(repositorio.save).toHaveBeenCalled();
      expect(resultado.cliente_nombre).toBe('Cliente actualizado');
    });

    it('debe lanzar ConflictException si el nuevo código ya existe', async () => {
      const dto = {
        codigo_orden: 'ORD-002',
      } as ActualizarOrdenDto;

      repositorio.findOne
        .mockResolvedValueOnce(ordenEjemplo)
        .mockResolvedValueOnce({
          ...ordenEjemplo,
          id: 2,
          codigo_orden: 'ORD-002',
        });

      await expect(servicio.actualizar(1, dto)).rejects.toThrow(
        ConflictException,
      );

      expect(repositorio.save).not.toHaveBeenCalled();
    });
  });

  describe('eliminar', () => {
    it('debe desactivar una orden sin eliminarla físicamente', async () => {
      const orden = { ...ordenEjemplo };

      repositorio.findOne.mockResolvedValue(orden);
      repositorio.save.mockImplementation(async (registro) => registro);

      const resultado = await servicio.eliminar(1);

      expect(orden.activo).toBe(false);
      expect(repositorio.save).toHaveBeenCalledWith(orden);
      expect(resultado).toEqual({
        message: 'La orden 1 fue eliminada correctamente.',
      });
    });

    it('debe lanzar NotFoundException si la orden no existe', async () => {
      repositorio.findOne.mockResolvedValue(null);

      await expect(servicio.eliminar(99)).rejects.toThrow(
        NotFoundException,
      );

      expect(repositorio.save).not.toHaveBeenCalled();
    });
  });
});
