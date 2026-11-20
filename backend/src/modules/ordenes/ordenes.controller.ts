import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Delete,
  Query,
} from '@nestjs/common';
import {
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CrearOrdenDto } from '#src/modules/ordenes/dto/crear-orden.dto';
import { ActualizarOrdenDto } from '#src/modules/ordenes/dto/actualizar-orden.dto';
import { ConsultarOrdenesDto } from '#src/modules/ordenes/dto/consultar-ordenes.dto';
import { OrdenesService } from '#src/modules/ordenes/ordenes.service';

// Agrupa la documentación de los endpoints de órdenes en Swagger.
@ApiTags('Órdenes')
@Controller('ordenes')
export class OrdenesController {
  // Inyecta el servicio encargado de ejecutar la lógica de las órdenes.
  constructor(private readonly ordenesService: OrdenesService) {}

  // Consulta las órdenes aplicando los filtros y la paginación recibidos.
  @Get()
  @ApiOperation({ summary: 'Consultar órdenes de servicio' })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 10 })
  @ApiQuery({ name: 'cliente_nombre', required: false, example: 'Kevin Quintero' })
  @ApiQuery({ name: 'estado', required: false, example: 'Pendiente' })
  @ApiResponse({ status: 200, description: 'Órdenes consultadas correctamente.' })
  consultarTodas(@Query() filtros: ConsultarOrdenesDto) {
    return this.ordenesService.consultarTodas(filtros);
  }

  // Consulta una orden específica mediante su identificador.
  @Get(':id')
  @ApiOperation({ summary: 'Consultar una orden por ID' })
  @ApiParam({ name: 'id', type: Number, example: 1 })
  @ApiResponse({ status: 200, description: 'Orden consultada correctamente.' })
  @ApiResponse({ status: 404, description: 'Orden no encontrada.' })
  consultarPorId(@Param('id', ParseIntPipe) id: number) {
    return this.ordenesService.consultarPorId(id);
  }

  // Registra una nueva orden de servicio.
  @Post()
  @ApiOperation({ summary: 'Crear una orden de servicio' })
  @ApiResponse({ status: 201, description: 'Orden creada correctamente.' })
  @ApiResponse({ status: 400, description: 'Los datos enviados no son válidos.' })
  @ApiResponse({ status: 409, description: 'El código de orden ya existe.' })
  crear(@Body() dto: CrearOrdenDto) {
    return this.ordenesService.crear(dto);
  }


  // Actualiza los campos enviados de una orden existente.
  @Put(':id')
  @ApiOperation({ summary: 'Actualizar una orden de servicio' })
  @ApiParam({ name: 'id', type: Number, example: 1 })
  @ApiResponse({ status: 200, description: 'Orden actualizada correctamente.' })
  @ApiResponse({ status: 400, description: 'Los datos enviados no son válidos.' })
  @ApiResponse({ status: 404, description: 'Orden no encontrada.' })
  @ApiResponse({ status: 409, description: 'El código de orden ya existe.' })
  actualizar(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: ActualizarOrdenDto,
  ) {
    return this.ordenesService.actualizar(id, dto);
  }

    // Elimina lógicamente una orden mediante su identificador.
  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar una orden de servicio' })
  @ApiParam({ name: 'id', type: Number, example: 1 })
  @ApiResponse({ status: 200, description: 'Orden eliminada correctamente.' })
  @ApiResponse({ status: 404, description: 'Orden no encontrada o ya eliminada.' })
  eliminar(@Param('id', ParseIntPipe) id: number) {
    return this.ordenesService.eliminar(id);
  }
}
