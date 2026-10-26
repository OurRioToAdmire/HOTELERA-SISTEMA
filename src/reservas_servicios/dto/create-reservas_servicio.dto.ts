import { IsString, IsInt, IsOptional, Min, MaxLength, IsNotEmpty } from 'class-validator';

export class CreateReservasServiciosDto {

  @IsInt()
  reservasServiciosId: number;

  @IsInt()
  @IsNotEmpty()
  reservaId: number;

  @IsInt()
  @IsNotEmpty()
  serviciosId: number;

  @IsString()
  @IsNotEmpty()
  descripcion: string;
}