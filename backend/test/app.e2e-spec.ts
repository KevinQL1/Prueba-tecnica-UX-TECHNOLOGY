
import {
  INestApplication,
  ValidationPipe,
  NotFoundException,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { OrdenesController } from '#src/modules/ordenes/ordenes.controller';
import { OrdenesService } from '#src/modules/ordenes/ordenes.service';

// Agrupa las pruebas de integración de los endpoints de órdenes.
describe('OrdenesController (e2e)', () => {
  let app: INestApplication;

  // Simula los métodos del servicio para evitar conexiones a MySQL.
  const ordenesServiceMock = {
    consultarTodas: jest.fn(),
    consultarPorId: jest.fn(),
    crear: jest.fn(),
    actualizar: jest.fn(),
    eliminar: jest.fn(),
  };

  // Representa una orden válida para las pruebas HTTP.
  const ordenEjemplo = {
    id: 1,
    codigo_orden: 'ORD-2026-001',
    cliente_nombre: 'Cliente de prueba',
    cantidad_items: 5,
    valor_total: 2500000,
    porcentaje_descuento: 10,
    fecha_solicitud: '2026-11-19',
    estado: 'Pendiente',
    prioridad: 'Alta',
    observaciones: 'Orden de prueba',
    activo: true,
  };

  // Representa los datos válidos para crear una orden.
  const crearOrdenDto = {
    codigo_orden: 'ORD-2026-001',
    cliente_nombre: 'Cliente de prueba',
    cantidad_items: 5,
    valor_total: 2500000,
    porcentaje_descuento: 10,
    fecha_solicitud: '2026-11-19',
    estado: 'Pendiente',
    prioridad: 'Alta',
    observaciones: 'Orden de prueba',
  };

  beforeEach(async () => {
    // Construye un módulo aislado con el controlador y el servicio simulado.
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [OrdenesController],
      providers: [
        {
          provide: OrdenesService,
          useValue: ordenesServiceMock,
        },
      ],
    }).compile();

    // Inicializa la aplicación de pruebas.
    app = moduleFixture.createNestApplication();

    // Reproduce el prefijo global y las validaciones de main.ts.
    app.setGlobalPrefix('api');
    app.useGlobalPipes(
      new ValidationPipe({
        transform: true,
        whitelist: true,
        forbidNonWhitelisted: true,
      }),
    );

    await app.init();
  });

  afterEach(async () => {
    // Limpia los registros de llamadas y cierra la aplicación.
    jest.clearAllMocks();
    await app.close();
  });

  describe('GET /api/ordenes', () => {
    it('debe retornar las órdenes con paginación', async () => {
      const respuesta = {
        data: [ordenEjemplo],
        pagination: {
          total: 1,
          page: 1,
          limit: 10,
          totalPages: 1,
        },
      };

      ordenesServiceMock.consultarTodas.mockResolvedValue(respuesta);

      await request(app.getHttpServer())
        .get('/api/ordenes')
        .expect(200)
        .expect(respuesta);

      expect(ordenesServiceMock.consultarTodas).toHaveBeenCalledWith({
        page: 1,
        limit: 10,
      });
    });

    it('debe transformar y enviar los filtros de consulta', async () => {
      ordenesServiceMock.consultarTodas.mockResolvedValue({
        data: [],
        pagination: {
          total: 0,
          page: 2,
          limit: 5,
          totalPages: 0,
        },
      });

      await request(app.getHttpServer())
        .get('/api/ordenes')
        .query({
          page: 2,
          limit: 5,
          cliente_nombre: 'Kevin',
          estado: 'Pendiente',
        })
        .expect(200);

      expect(ordenesServiceMock.consultarTodas).toHaveBeenCalledWith({
        page: 2,
        limit: 5,
        cliente_nombre: 'Kevin',
        estado: 'Pendiente',
      });
    });

    it('debe rechazar un estado no permitido', async () => {
      await request(app.getHttpServer())
        .get('/api/ordenes')
        .query({ estado: 'En espera' })
        .expect(400);

      expect(ordenesServiceMock.consultarTodas).not.toHaveBeenCalled();
    });

    it('debe rechazar un límite superior a 100', async () => {
      await request(app.getHttpServer())
        .get('/api/ordenes')
        .query({ limit: 101 })
        .expect(400);

      expect(ordenesServiceMock.consultarTodas).not.toHaveBeenCalled();
    });
  });

  describe('GET /api/ordenes/:id', () => {
    it('debe retornar una orden cuando existe', async () => {
      ordenesServiceMock.consultarPorId.mockResolvedValue(ordenEjemplo);

      await request(app.getHttpServer())
        .get('/api/ordenes/1')
        .expect(200)
        .expect(ordenEjemplo);

      expect(ordenesServiceMock.consultarPorId).toHaveBeenCalledWith(1);
    });

    it('debe retornar 404 cuando la orden no existe', async () => {
      ordenesServiceMock.consultarPorId.mockRejectedValue(
        new NotFoundException('Orden no encontrada'),
      );

      await request(app.getHttpServer())
        .get('/api/ordenes/99')
        .expect(404);
    });

    it('debe rechazar un identificador que no sea numérico', async () => {
      await request(app.getHttpServer())
        .get('/api/ordenes/abc')
        .expect(400);

      expect(ordenesServiceMock.consultarPorId).not.toHaveBeenCalled();
    });
  });

  describe('POST /api/ordenes', () => {
    it('debe crear una orden correctamente', async () => {
      ordenesServiceMock.crear.mockResolvedValue({
        id: 1,
        ...crearOrdenDto,
        activo: true,
      });

      await request(app.getHttpServer())
        .post('/api/ordenes')
        .send(crearOrdenDto)
        .expect(201)
        .expect({
          id: 1,
          ...crearOrdenDto,
          activo: true,
        });

      expect(ordenesServiceMock.crear).toHaveBeenCalledWith(
        crearOrdenDto,
      );
    });

    it('debe rechazar una solicitud sin los campos obligatorios', async () => {
      await request(app.getHttpServer())
        .post('/api/ordenes')
        .send({
          codigo_orden: 'ORD-2026-002',
          cliente_nombre: 'Cliente de prueba',
        })
        .expect(400);

      expect(ordenesServiceMock.crear).not.toHaveBeenCalled();
    });

    it('debe rechazar una cantidad de ítems menor que uno', async () => {
      await request(app.getHttpServer())
        .post('/api/ordenes')
        .send({
          ...crearOrdenDto,
          cantidad_items: 0,
        })
        .expect(400);

      expect(ordenesServiceMock.crear).not.toHaveBeenCalled();
    });

    it('debe rechazar un porcentaje de descuento superior a 100', async () => {
      await request(app.getHttpServer())
        .post('/api/ordenes')
        .send({
          ...crearOrdenDto,
          porcentaje_descuento: 150,
        })
        .expect(400);

      expect(ordenesServiceMock.crear).not.toHaveBeenCalled();
    });

    it('debe rechazar una prioridad no permitida', async () => {
      await request(app.getHttpServer())
        .post('/api/ordenes')
        .send({
          ...crearOrdenDto,
          prioridad: 'Urgente',
        })
        .expect(400);

      expect(ordenesServiceMock.crear).not.toHaveBeenCalled();
    });

    it('debe rechazar propiedades que no estén definidas en el DTO', async () => {
      await request(app.getHttpServer())
        .post('/api/ordenes')
        .send({
          ...crearOrdenDto,
          campo_inexistente: 'No permitido',
        })
        .expect(400);

      expect(ordenesServiceMock.crear).not.toHaveBeenCalled();
    });
  });

  describe('PUT /api/ordenes/:id', () => {
    it('debe actualizar una orden correctamente', async () => {
      const dto = {
        cliente_nombre: 'Cliente actualizado',
        estado: 'En Proceso',
      };

      ordenesServiceMock.actualizar.mockResolvedValue({
        ...ordenEjemplo,
        ...dto,
      });

      await request(app.getHttpServer())
        .put('/api/ordenes/1')
        .send(dto)
        .expect(200)
        .expect({
          ...ordenEjemplo,
          ...dto,
        });

      expect(ordenesServiceMock.actualizar).toHaveBeenCalledWith(1, dto);
    });

    it('debe rechazar un estado no permitido', async () => {
      await request(app.getHttpServer())
        .put('/api/ordenes/1')
        .send({ estado: 'En espera' })
        .expect(400);

      expect(ordenesServiceMock.actualizar).not.toHaveBeenCalled();
    });

    it('debe rechazar un identificador no numérico', async () => {
      await request(app.getHttpServer())
        .put('/api/ordenes/abc')
        .send({ cliente_nombre: 'Cliente actualizado' })
        .expect(400);

      expect(ordenesServiceMock.actualizar).not.toHaveBeenCalled();
    });

    it('debe rechazar propiedades no permitidas', async () => {
      await request(app.getHttpServer())
        .put('/api/ordenes/1')
        .send({ campo_inexistente: 'No permitido' })
        .expect(400);

      expect(ordenesServiceMock.actualizar).not.toHaveBeenCalled();
    });
  });

  describe('DELETE /api/ordenes/:id', () => {
    it('debe eliminar lógicamente una orden', async () => {
      const respuesta = {
        message: 'La orden 1 fue eliminada correctamente.',
      };

      ordenesServiceMock.eliminar.mockResolvedValue(respuesta);

      await request(app.getHttpServer())
        .delete('/api/ordenes/1')
        .expect(200)
        .expect(respuesta);

      expect(ordenesServiceMock.eliminar).toHaveBeenCalledWith(1);
    });

    it('debe retornar 404 cuando la orden no existe', async () => {
      ordenesServiceMock.eliminar.mockRejectedValue(
        new NotFoundException('Orden no encontrada'),
      );

      await request(app.getHttpServer())
        .delete('/api/ordenes/99')
        .expect(404);
    });

    it('debe rechazar un identificador no numérico', async () => {
      await request(app.getHttpServer())
        .delete('/api/ordenes/abc')
        .expect(400);

      expect(ordenesServiceMock.eliminar).not.toHaveBeenCalled();
    });
  });
});
