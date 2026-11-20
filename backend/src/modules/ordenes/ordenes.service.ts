import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CrearOrdenDto } from './dto/crear-orden.dto';
import { ActualizarOrdenDto } from './dto/actualizar-orden.dto';
import { ConsultarOrdenesDto } from './dto/consultar-ordenes.dto';
import { OrdenServicio } from './entities/orden-servicio.entity';

// Contiene la lógica de negocio para gestionar las órdenes de servicio.
@Injectable()
export class OrdenesService {
  // Inyecta el repositorio que permite consultar la tabla de órdenes.
  constructor(
    @InjectRepository(OrdenServicio)
    private readonly ordenesRepository: Repository<OrdenServicio>,
  ) {}

  // Consulta las órdenes activas aplicando filtros y paginación.
  async consultarTodas(filtros: ConsultarOrdenesDto) {
    // Obtiene los parámetros de paginación definidos en el DTO.
    const { page, limit, cliente_nombre, estado } = filtros;

    // Calcula desde qué registro debe comenzar la consulta.
    const skip = (page - 1) * limit;

    // Construye la consulta sobre las órdenes activas.
    const consulta = this.ordenesRepository
      .createQueryBuilder('orden')
      .where('orden.activo = :activo', { activo: 1 });

    // Filtra por nombre de cliente cuando se recibe el parámetro.
    if (cliente_nombre) {
      consulta.andWhere('orden.cliente_nombre LIKE :cliente', {
        cliente: `%${cliente_nombre}%`,
      });
    }

    // Filtra por estado cuando se recibe el parámetro.
    if (estado) {
      consulta.andWhere('orden.estado = :estado', { estado });
    }

    // Ejecuta la consulta y obtiene los registros y el total encontrado.
    const [ordenes, total] = await consulta
      .orderBy('orden.fecha_creacion', 'DESC')
      .skip(skip)
      .take(limit)
      .getManyAndCount();

    // Retorna los resultados junto con la información de paginación.
    return {
      data: ordenes,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

    // Consulta una orden por su ID y verifica que esté activa.
  async consultarPorId(id: number) {
    // Busca la orden por su identificador y estado activo.
    const orden = await this.ordenesRepository.findOne({
      where: {
        id,
        activo: true,
      },
    });

    // Retorna un error 404 cuando la orden no existe o está eliminada.
    if (!orden) {
      throw new NotFoundException(`No se encontró la orden con ID ${id}.`);
    }

    // Retorna la orden encontrada.
    return orden;
  }

  // Crea una nueva orden de servicio.
  async crear(dto: CrearOrdenDto) {
    // Comprueba que el código de la orden no esté registrado.
    const ordenExistente = await this.ordenesRepository.findOne({
      where: { codigo_orden: dto.codigo_orden },
    });

    // Evita registrar dos órdenes con el mismo código.
    if (ordenExistente) {
      throw new ConflictException(
        `Ya existe una orden con el código ${dto.codigo_orden}.`,
      );
    }

    // Construye la entidad con los datos recibidos.
    const nuevaOrden = this.ordenesRepository.create({
      ...dto,
      activo: true,
    });

    // Guarda la nueva orden y retorna el registro creado.
    return this.ordenesRepository.save(nuevaOrden);
  }


  // Actualiza parcialmente una orden de servicio existente.
  async actualizar(id: number, dto: ActualizarOrdenDto) {
    // Verifica que la orden exista y permanezca activa.
    const orden = await this.consultarPorId(id);

    // Comprueba si el nuevo código pertenece a otra orden.
    if (dto.codigo_orden && dto.codigo_orden !== orden.codigo_orden) {
      const ordenExistente = await this.ordenesRepository.findOne({
        where: { codigo_orden: dto.codigo_orden },
      });

      // Evita asignar un código que ya está registrado.
      if (ordenExistente) {
        throw new ConflictException(
          `Ya existe una orden con el código ${dto.codigo_orden}.`,
        );
      }
    }

    // Aplica únicamente los campos enviados en la solicitud.
    Object.assign(orden, dto);

    // Guarda los cambios y retorna la orden actualizada.
    return this.ordenesRepository.save(orden);
  }


  // Elimina lógicamente una orden de servicio.
  async eliminar(id: number) {
    // Verifica que la orden exista y permanezca activa.
    const orden = await this.consultarPorId(id);

    // Cambia el estado de la orden a inactivo.
    orden.activo = false;

    // Guarda el cambio sin eliminar físicamente el registro.
    await this.ordenesRepository.save(orden);

    // Retorna una confirmación de la operación.
    return {
      message: `La orden ${id} fue eliminada correctamente.`,
    };
  }
}
