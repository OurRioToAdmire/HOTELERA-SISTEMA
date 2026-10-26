import { PartialType } from '@nestjs/mapped-types';
import { CreateReservaDto } from './create-reserva.dto.js';

export class UpdateReservaDto extends PartialType(CreateReservaDto) {}
