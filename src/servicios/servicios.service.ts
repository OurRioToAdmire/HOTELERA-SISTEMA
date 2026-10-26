import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateServicioDto } from './dto/create-servicio.dto.js';
import { UpdateServicioDto } from './dto/update-servicio.dto.js';

import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
  
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Servicios } from './entities/servicio.entity.js';
import { ReservasServicios } from '../reservas_servicios/entities/reservas_servicio.entity.js';

@Injectable()
export class ServiciosService {
  constructor(
    @InjectRepository(Servicios)
    private readonly serviceRepository: Repository<Servicios>,

    private readonly httpService: HttpService,

    @InjectRepository(ReservasServicios)
    private readonly reservasServiciosRepository: Repository<ReservasServicios>,
  ) {}

  async validarRelacion(id: number) {
    try {
      return await firstValueFrom(
        this.httpService.get(
          `https://unbroken-sturdy-manned.ngrok-free.dev/habitaciones`,
        ),
      );
    } catch {
      throw new BadRequestException('El recurso relacionado no existe');
    }
  }

  async create(createServicioDto: CreateServicioDto) {
    const entidad = this.serviceRepository.create(createServicioDto);
    return await this.serviceRepository.save(entidad);
  }

  async findAll() {
    try {
      return await this.serviceRepository.find();
    } catch {
      throw new BadRequestException('Error al buscar servicios');
    }
  }

  async findOne(id: number) {
    const entidad = await this.serviceRepository.findOneBy({ id });

    if (!entidad) {
      throw new NotFoundException('Servicio no encontrado');
    }

    return entidad;
  }

  async update(id: number, updateServicioDto: UpdateServicioDto) {
    const entidad = await this.serviceRepository.preload({
      id,
      ...updateServicioDto,
    });

    if (!entidad) {
      throw new NotFoundException('Servicio no encontrado');
    }

    return await this.serviceRepository.save(entidad);
  }

  async remove(id: number) {
    const servicio = await this.serviceRepository.findOneBy({ id });

    if (!servicio) {
      throw new NotFoundException('Servicio no encontrado');
    }

    const relacion = await this.reservasServiciosRepository.findOneBy({
      servicioId: id,
    });

    if (relacion) {
      throw new BadRequestException(
        'No se puede eliminar un servicio que tiene reservaciones',
      );
    }

    await this.serviceRepository.delete(id);

    return { message: 'Servicio eliminado correctamente' };
  }
}