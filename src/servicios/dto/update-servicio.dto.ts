import { PartialType } from '@nestjs/mapped-types';
import { CreateServicioDto } from './create-servicio.dto.js';

export class UpdateServicioDto extends PartialType(CreateServicioDto) {}
