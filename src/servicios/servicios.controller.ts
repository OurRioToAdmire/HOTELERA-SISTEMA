import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { ServiciosService } from './servicios.service.js';
import { CreateServicioDto } from './dto/create-servicio.dto.js';
import { UpdateServicioDto } from './dto/update-servicio.dto.js';

@Controller('servicios')
export class ServiciosController {
  constructor(
    private readonly entidadService: ServiciosService,
  ) {}

  @Post()
  create(@Body() createServicioDto: CreateServicioDto) {
    return this.entidadService.create(createServicioDto);
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
    @Body() updateEntidadDto: UpdateServicioDto,
  ) {
    return this.entidadService.update(id, updateEntidadDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.entidadService.remove(id);
  }
}