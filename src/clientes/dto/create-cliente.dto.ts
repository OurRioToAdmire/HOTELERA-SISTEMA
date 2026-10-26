import { IsString, IsInt, IsOptional, Min, MaxLength } from 'class-validator';

export class CreateClienteDto {

  @IsInt()
  clienteId: number;

  @IsString()
  @MaxLength(2253)
  nombre: string;

  @IsString()
  @MaxLength(2253)
  apellido: string;

  @IsString()
  @MaxLength(10)
  telefono: string;

  @IsString()
  @MaxLength(100)
  correo: string;

}