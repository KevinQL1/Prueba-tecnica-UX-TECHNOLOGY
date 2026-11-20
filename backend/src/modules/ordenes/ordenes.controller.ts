
import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import {
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ConsultarOrdenesDto } from './dto/consultar-ordenes.dto';
import { OrdenesService } from './ordenes.service';

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
}
