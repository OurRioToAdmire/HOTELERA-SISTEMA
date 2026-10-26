import { PartialType } from '@nestjs/mapped-types';
import { CreateReservasServiciosDto } from './create-reservas_servicio.dto.js';

export class UpdateReservasServicioDto extends PartialType(CreateReservasServiciosDto) {}
