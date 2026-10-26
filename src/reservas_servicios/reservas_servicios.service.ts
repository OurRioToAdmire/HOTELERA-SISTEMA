import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateReservasServiciosDto } from './dto/create-reservas_servicio.dto.js';
import { UpdateReservasServicioDto } from './dto/update-reservas_servicio.dto.js';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { Reserva } from '../reserva/entities/reserva.entity.js';
import { Servicios } from '../servicios/entities/servicio.entity.js';
import { ReservasServicios } from './entities/reservas_servicio.entity.js';

@Injectable()
export class ReservasServiciosService {

  constructor(
    @InjectRepository(ReservasServicios)
    private readonly reservasServiciosRepository: Repository<ReservasServicios>,

    @InjectRepository(Reserva)
    private readonly reservaRepository: Repository<Reserva>,
    private readonly httpService: HttpService,
    
    @InjectRepository(Servicios)
    private readonly serviciosRepository: Repository<Servicios>,
  ) {}

  async create(dto: CreateReservasServiciosDto) {
  const reserva = await this.reservaRepository.findOneBy({
    id: dto.reservaId,
  });

  if (!reserva) {
    throw new NotFoundException('La reserva no existe');
  }

  const servicio = await this.serviciosRepository.findOneBy({
    id: dto.serviciosId,
  });

  if (!servicio) {
    throw new NotFoundException('El servicio no existe');
  }

  const entidad = this.reservasServiciosRepository.create(dto);

  return await this.reservasServiciosRepository.save(entidad);
}

  async findAll() {
    try {
      return await this.reservasServiciosRepository.find();
    } catch {
      throw new BadRequestException('Error al buscar entidad');
    }
  }

  async findOne(id: number) {
    const entidad = await this.reservasServiciosRepository.findOneBy({ reservasServiciosId: id });

    if (!entidad) {
      throw new NotFoundException('Entidad no encontrado');
    }

    return entidad;
  }

 async update(id: number, updateReservasServicioDto: UpdateReservasServicioDto) {
  const entidad = await this.reservasServiciosRepository.preload({
    reservasServiciosId: id,
    ...updateReservasServicioDto,
  });

  if (!entidad) {
    throw new NotFoundException('Registro no encontrado');
  }

  return this.reservasServiciosRepository.save(entidad);
}

 async remove(id: number) {
  throw new BadRequestException(
    // WHY DIE TRYINGGGGGGGGGG AT ALLLLLLLLLL
    'No se permite eliminar directamente una relacion entre reserva y servicio',
  );
}
}