import { IsInt, IsDateString, IsString, IsNotEmpty, IsEnum, IsArray, ArrayNotEmpty, IsOptional, Min, } from 'class-validator';

import { Estado as EstadoReserva } from '../../servicios/entities/servicio.entity.js';

export class CreateReservaDto {

    @IsNotEmpty()
  @IsInt()
  @Min(1)
  clienteId: number;

  @IsArray()
  @ArrayNotEmpty()
  @IsInt({ each: true })
  servicios: number[];

    @IsNotEmpty()
  @IsInt()
  @Min(1)
  habitacionId: number;

    @IsNotEmpty()
  @IsDateString()
  fechastart: string;

    @IsNotEmpty()
  @IsDateString()
  fechaend: string;

    @IsNotEmpty()
  @IsString()
  checkin: string;

    @IsNotEmpty()
  @IsString()
  checkout: string;

    @IsNotEmpty()
  @IsInt()
  @Min(1)
  huespuedes: number;

    @IsNotEmpty()
  @IsOptional()
  @IsEnum(EstadoReserva)
  estado?: EstadoReserva;

}
