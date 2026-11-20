
import { OrdenesController } from '../../../src/modules/ordenes/ordenes.controller';
import { OrdenesService } from '../../../src/modules/ordenes/ordenes.service';

// Agrupa las pruebas unitarias del controlador de órdenes.
describe('OrdenesController', () => {
  let controller: OrdenesController;

  // Simula los métodos del servicio de órdenes.
  let servicioMock: {
    consultarTodas: jest.Mock;
    consultarPorId: jest.Mock;
    crear: jest.Mock;
    actualizar: jest.Mock;
    eliminar: jest.Mock;
  };

  beforeEach(() => {
    // Configura las respuestas simuladas del servicio.
    servicioMock = {
      consultarTodas: jest.fn(),
      consultarPorId: jest.fn(),
      crear: jest.fn(),
      actualizar: jest.fn(),
      eliminar: jest.fn(),
    };

    // Instancia el controlador con el servicio simulado.
    controller = new OrdenesController(
      servicioMock as unknown as OrdenesService,
    );
  });

  it('debe consultar todas las órdenes', async () => {
    const filtros = { page: 1, limit: 10 };
    const respuesta = { data: [], pagination: { total: 0 } };

    servicioMock.consultarTodas.mockResolvedValue(respuesta);

    await expect(controller.consultarTodas(filtros)).resolves.toEqual(
      respuesta,
    );

    expect(servicioMock.consultarTodas).toHaveBeenCalledWith(filtros);
  });

  it('debe consultar una orden por ID', async () => {
    const orden = { id: 1, codigo_orden: 'ORD-001' };

    servicioMock.consultarPorId.mockResolvedValue(orden);

    await expect(controller.consultarPorId(1)).resolves.toEqual(orden);

    expect(servicioMock.consultarPorId).toHaveBeenCalledWith(1);
  });

  it('debe crear una orden', async () => {
    const dto = { codigo_orden: 'ORD-002' };
    const ordenCreada = { id: 2, ...dto };

    servicioMock.crear.mockResolvedValue(ordenCreada);

    await expect(controller.crear(dto as any)).resolves.toEqual(
      ordenCreada,
    );

    expect(servicioMock.crear).toHaveBeenCalledWith(dto);
  });

  it('debe actualizar una orden', async () => {
    const dto = { cliente_nombre: 'Cliente actualizado' };
    const ordenActualizada = { id: 1, ...dto };

    servicioMock.actualizar.mockResolvedValue(ordenActualizada);

    await expect(
      controller.actualizar(1, dto as any),
    ).resolves.toEqual(ordenActualizada);

    expect(servicioMock.actualizar).toHaveBeenCalledWith(1, dto);
  });

  it('debe eliminar una orden', async () => {
    const respuesta = {
      message: 'La orden 1 fue eliminada correctamente.',
    };

    servicioMock.eliminar.mockResolvedValue(respuesta);

    await expect(controller.eliminar(1)).resolves.toEqual(respuesta);

    expect(servicioMock.eliminar).toHaveBeenCalledWith(1);
  });
});
