import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { ReservasServiciosService } from './reservas_servicios.service.js';
import { CreateReservasServiciosDto } from './dto/create-reservas_servicio.dto.js';
import { UpdateReservasServicioDto } from './dto/update-reservas_servicio.dto.js';

@Controller('reservas_servicios')
export class ReservasServiciosController {

  constructor(
    private readonly entidadService: ReservasServiciosService
  ) {}

  @Post()
  create(@Body() createEntidadDto: CreateReservasServiciosDto) {
    return this.entidadService.create(createEntidadDto);
  }

  @Get()
  findAll() {
    return this.entidadService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.entidadService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateEntidadDto: UpdateReservasServicioDto
  ) {
    return this.entidadService.update(id, updateEntidadDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.entidadService.remove(id);
  }
}