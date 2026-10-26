import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateClienteDto } from './dto/create-cliente.dto.js';
import { UpdateClienteDto } from './dto/update-cliente.dto.js';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { Cliente } from './entities/cliente.entity.js';
import { Reserva } from '../reserva/entities/reserva.entity.js';

@Injectable()
export class ClientesService {

  constructor(
    @InjectRepository(Reserva)
    private reservaRepository: Repository<Reserva>,
    @InjectRepository(Cliente)
    private readonly clienteRepository: Repository<Cliente>,
    
  ) {}
  
async create(createClienteDto: CreateClienteDto) {
  const { nombre, apellido, telefono, correo } = createClienteDto;

  const clienteExistente = await this.clienteRepository.findOne({
    where: [
      { nombre, apellido, telefono, correo },
    ],
  });

  if (clienteExistente) {
    // CONFLICT EXCEPTION KAF;LAFOFAPOFA
    throw new ConflictException(
      'Ya existe un cliente con esos datos',
    );
  }

  const entidad = this.clienteRepository.create(createClienteDto);
  return await this.clienteRepository.save(entidad);
}
  async findAll() {
    try {
      return await this.clienteRepository.find();
    } catch {
      throw new BadRequestException('Error al buscar cliente');
    }
  }

  async findOne(id: number) {
    const entidad = await this.clienteRepository.findOneBy({ id });

    if (!entidad) {
      throw new NotFoundException('Cliente no encontrado');
    }

    return entidad;
  }

  async update(id: number, updateEntidadDto: UpdateClienteDto) {
    const entidad = await this.clienteRepository.preload({
      id,
      ...updateEntidadDto
    });

    if (!entidad) {
      throw new NotFoundException('Cliente no encontrado');
    }

    return await this.clienteRepository.save(entidad);
  }

  async remove(id: number) {
  const entidad = await this.clienteRepository.findOneBy({ id });

  if (!entidad) {
    throw new NotFoundException('Cliente no encontrado');
  }

  // si tiene reserva c lo bloquea 
  const reserva = await this.reservaRepository.findOneBy({
    clienteId: id,
  });

  if (reserva) {
    throw new BadRequestException(
      'No se puede eliminar el cliente porque tiene reservas'
    );
  }

  // y si no todo chido
  await this.clienteRepository.delete(id);

  return { message: 'Cliente eliminado correctamente' };
  
}

async findHistorial(id: number) {
  // Buscar al cliente
  const cliente = await this.clienteRepository.findOneBy({ id });

  if (!cliente) {
    throw new NotFoundException('Cliente no encontrado');
  }

  // Buscar sus reservas
  const reservas = await this.reservaRepository.find({
    where: {
      clienteId: id,
    },
  });

  return {
    cliente,
    totalReservas: reservas.length,
    historial: reservas,
  };
}
}