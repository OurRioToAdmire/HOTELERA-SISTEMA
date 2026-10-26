
import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ServiceUnavailableException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  In,
  LessThan,
  MoreThan,
  Repository,
} from 'typeorm';
import axios from 'axios';

import { Reserva } from './entities/reserva.entity.js';
import {
  Servicios,
  Estado as EstadoServicio,
} from '../servicios/entities/servicio.entity.js';
import { Estado as EstadoReserva } from './entities/reserva.entity.js';
import { UpdateReservaDto } from './dto/update-reserva.dto.js';
import { Cliente } from '../clientes/entities/cliente.entity.js';
import { CreateReservaDto } from './dto/create-reserva.dto.js';
import { ReservasServicios } from '../reservas_servicios/entities/reservas_servicio.entity.js';

@Injectable()
export class ReservaService {
  private readonly habitacionesUrl =
    'https://unbroken-sturdy-manned.ngrok-free.dev';

  constructor(
    @InjectRepository(Reserva)
    private readonly reservaRepository: Repository<Reserva>,

    @InjectRepository(Servicios)
    private readonly servicioRepository: Repository<Servicios>,

    @InjectRepository(Cliente)
    private readonly clienteRepository: Repository<Cliente>,

    @InjectRepository(ReservasServicios)
    private readonly reservasServiciosRepository: Repository<ReservasServicios>,
  ) {}

  
private async consultarHabitacion(habitacionId: number) {
  let habitacion: any;

  try {
    const respuesta = await axios.get(
      `${this.habitacionesUrl}/habitaciones/${habitacionId}`,
    );

    habitacion = respuesta.data;
  } catch {
    throw new ServiceUnavailableException(
      'No se pudo consultar la habitacion',
    );
  }

  if (!habitacion || !habitacion.id) {
    throw new NotFoundException('La habitacion no existe');
  }

  const tipoHabitacionId =
    habitacion.tipoId ??
    habitacion.tipoHabitacionId ??
    (typeof habitacion.tipo === 'object'
      ? habitacion.tipo?.id
      : habitacion.tipo);

  if (tipoHabitacionId == null) {
    throw new NotFoundException(
      'La habitacion no tiene un tipo de habitacion asociado',
    );
  }

  let tipoHabitacion: any;

  try {
    const respuestaTipo = await axios.get(
      `${this.habitacionesUrl}/tipo-habitacion/${tipoHabitacionId}`,
    );

    tipoHabitacion = respuestaTipo.data;
  } catch {
    throw new ServiceUnavailableException(
      'No se pudo consultar el tipo de habitacion',
    );
  }

  if (!tipoHabitacion || !tipoHabitacion.id) {
    throw new NotFoundException(
      'No existe el tipo de habitacion asociado',
    );
  }

  return { habitacion, tipoHabitacion };
}


  private validarFechas(inicio: Date, fin: Date) {
    if (
      Number.isNaN(inicio.getTime()) ||
      Number.isNaN(fin.getTime())
    ) {
      throw new BadRequestException(
        'Las fechas no son validas',
      );
    }

    if (fin <= inicio) {
      throw new BadRequestException(
        'La fecha final debe ser posterior a la inicial',
      );
    }
  }

  private validarHuespedes(
    huespuedes: number,
    capacidad: number,
  ) {
    if (
      !Number.isInteger(huespuedes) ||
      huespuedes < 1
    ) {
      throw new BadRequestException(
        'La cantidad de huespedes debe ser un numero entero mayor que cero',
      );
    }

    if (
      !Number.isFinite(capacidad) ||
      capacidad < 1
    ) {
      throw new ServiceUnavailableException(
        'La capacidad de la habitacion no es valida',
      );
    }

    if (huespuedes > capacidad) {
      throw new BadRequestException(
        `La habitacion permite un maximo de ${capacidad} huespedes`,
      );
    }
  }

  private validarServiciosIds(ids: number[]) {
    if (
      !Array.isArray(ids) ||
      ids.length < 1 ||
      ids.length > 5
    ) {
      throw new BadRequestException(
        'Debes seleccionar entre 1 y 5 servicios',
      );
    }

    if (new Set(ids).size !== ids.length) {
      throw new BadRequestException(
        'No puedes seleccionar el mismo servicio mas de una vez',
      );
    }
  }

  private async consultarServicios(ids: number[]) {
    this.validarServiciosIds(ids);

    const servicios = await this.servicioRepository.findBy({
      id: In(ids),
    });

    if (servicios.length !== ids.length) {
      throw new BadRequestException(
        'Uno o mas servicios no existen',
      );
    }

    if (
      servicios.some(
        (servicio) => servicio.estado !== EstadoServicio.ACTIVO,
      )
    ) {
      throw new BadRequestException(
        'Uno o mas servicios no estan activos',
      );
    }

    return servicios;
  }

  private async validarDisponibilidad(
    habitacionId: number,
    inicio: Date,
    fin: Date,
    reservaId?: number,
  ) {
    const reservaExistente = await this.reservaRepository
      .createQueryBuilder('reserva')
      .where('reserva.habitacionId = :habitacionId', {
        habitacionId,
      })
      .andWhere('reserva.fechastart < :fin', { fin })
      .andWhere('reserva.fechaend > :inicio', { inicio })
      .andWhere(
        reservaId !== undefined
          ? 'reserva.id != :reservaId'
          : '1 = 1',
        reservaId !== undefined ? { reservaId } : {},
      )
      .getOne();

    if (reservaExistente) {
      throw new BadRequestException(
        'La habitacion ya esta reservada para esas fechas',
      );
    }
  }

  async create(createReservaDto: CreateReservaDto) {
    const cliente = await this.clienteRepository.findOneBy({
      id: createReservaDto.clienteId,
    });

    if (!cliente) {
      throw new NotFoundException('El cliente no existe');
    }

    const inicio = new Date(createReservaDto.fechastart);
    const fin = new Date(createReservaDto.fechaend);

    this.validarFechas(inicio, fin);

    const ahora = new Date();

    if (inicio < ahora) {
      throw new BadRequestException(
        'La fecha de inicio no puede estar en el pasado',
      );
    }

    const { tipoHabitacion } = await this.consultarHabitacion(
      createReservaDto.habitacionId,
    );

    const capacidad = Number(tipoHabitacion.capacidad);
    const huespuedes = Number(createReservaDto.huespuedes);

    this.validarHuespedes(huespuedes, capacidad);

    await this.validarDisponibilidad(
      createReservaDto.habitacionId,
      inicio,
      fin,
    );

    const servicios = await this.consultarServicios(
      createReservaDto.servicios,
    );

    const reserva = this.reservaRepository.create({
      ...createReservaDto,
      fechastart: inicio,
      fechaend: fin,
      huespuedes,
      estado: EstadoReserva.RESERVADA,
      servicios,
    });

    return this.reservaRepository.save(reserva);
  }

  async findAll() {
    return this.reservaRepository.find({
      relations: {
        servicios: true,
      },
    });
  }

  async findOne(id: number) {
    const reserva = await this.reservaRepository.findOne({
      where: { id },
      relations: {
        servicios: true,
      },
    });

    if (!reserva) {
      throw new NotFoundException(
        'Reserva no encontrada',
      );
    }

    return reserva;
  }

  async update(id: number, dto: UpdateReservaDto) {
    const reserva = await this.reservaRepository.findOne({
      where: { id },
      relations: {
        servicios: true,
      },
    });

    if (!reserva) {
      throw new NotFoundException(
        'Reserva no encontrada',
      );
    }

    const {
      servicios: ids,
      fechastart,
      fechaend,
      habitacionId,
      huespuedes,
      ...datos
    } = dto;

    const inicio = new Date(
      fechastart ?? reserva.fechastart,
    );

    const fin = new Date(
      fechaend ?? reserva.fechaend,
    );

    this.validarFechas(inicio, fin);

    if (fechastart !== undefined) {
      if (inicio < new Date()) {
        throw new BadRequestException(
          'La fecha de inicio no puede estar en el pasado',
        );
      }
    }

    const nuevaHabitacionId =
      habitacionId ?? reserva.habitacionId;

    const nuevosHuespuedes = Number(
      huespuedes ?? reserva.huespuedes,
    );

    if (
      habitacionId !== undefined ||
      huespuedes !== undefined
    ) {
      const { tipoHabitacion } =
        await this.consultarHabitacion(
          nuevaHabitacionId,
        );

      this.validarHuespedes(
        nuevosHuespuedes,
        Number(tipoHabitacion.capacidad),
      );
    }

    if (
      fechastart !== undefined ||
      fechaend !== undefined ||
      habitacionId !== undefined
    ) {
      await this.validarDisponibilidad(
        nuevaHabitacionId,
        inicio,
        fin,
        id,
      );
    }

    let serviciosActualizados:
      | Servicios[]
      | undefined;

    if (ids !== undefined) {
      serviciosActualizados =
        await this.consultarServicios(ids);
    }

    Object.assign(reserva, datos, {
      fechastart: inicio,
      fechaend: fin,
      habitacionId: nuevaHabitacionId,
      huespuedes: nuevosHuespuedes,
    });

    if (serviciosActualizados !== undefined) {
      reserva.servicios = serviciosActualizados;
    }

    return this.reservaRepository.save(reserva);
  }

  
  async remove(id: number) {
    const reserva = await this.reservaRepository.findOneBy({
      id,
    });

    if (!reserva) {
      throw new NotFoundException(
        'Reserva no encontrada',
      );
    }

    await this.reservaRepository.manager.transaction(
      async (manager) => {
        await manager
          .getRepository(ReservasServicios)
          .delete({ reservaId: id });

        await manager
          .getRepository(Reserva)
          .delete(id);
      },
    );

    return {
      message: 'Reserva eliminada correctamente',
    };
  }

  async calcularIngresos() {
    const reservas = await this.reservaRepository.find({
      relations: {
        servicios: true,
      },
    });

    let ingresosHabitaciones = 0;
    let ingresosServicios = 0;

    for (const reserva of reservas) {
      const inicio = new Date(reserva.fechastart);
      const fin = new Date(reserva.fechaend);

      this.validarFechas(inicio, fin);

      const inicioUTC = Date.UTC(
        inicio.getFullYear(),
        inicio.getMonth(),
        inicio.getDate(),
      );

      const finUTC = Date.UTC(
        fin.getFullYear(),
        fin.getMonth(),
        fin.getDate(),
      );

      const noches =
        (finUTC - inicioUTC) / (1000 * 60 * 60 * 24);

      const { tipoHabitacion } =
        await this.consultarHabitacion(
          reserva.habitacionId,
        );

      const precio = Number(tipoHabitacion.precio);

      if (!Number.isFinite(precio) || precio < 0) {
        throw new ServiceUnavailableException(
          'El precio de la habitacion no es valido',
        );
      }

      ingresosHabitaciones += noches * precio;

      for (const servicio of reserva.servicios) {
        const precioServicio = Number(servicio.precio);

        if (
          !Number.isFinite(precioServicio) ||
          precioServicio < 0
        ) {
          throw new ServiceUnavailableException(
            'El precio de un servicio no es valido',
          );
        }

        ingresosServicios += precioServicio;
      }
    }

    return {
      ingresosHabitaciones,
      ingresosServicios,
      ingresosTotales:
        ingresosHabitaciones + ingresosServicios,
      moneda: 'MXN',
    };
  }
}
