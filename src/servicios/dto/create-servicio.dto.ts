

    import { IsString, IsInt, IsOptional, Min, MaxLength, isNotEmpty, isNumber, IsNotEmpty, IsNumber } from 'class-validator';
import { Double } from 'typeorm/driver/mongodb/bson.typings.js';
    
    export class CreateServicioDto {
    
      @IsInt()
      ServicioId: number;
    
      @IsString()
      @MaxLength(100)
      nombre: string;
    
      @IsOptional()
      @IsString()
      descripcion?: string;

      @IsNotEmpty()
      @IsNumber()
      precio: number;
    }

