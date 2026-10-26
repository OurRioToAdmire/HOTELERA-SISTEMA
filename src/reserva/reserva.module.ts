import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Reserva } from './entities/reserva.entity.js';
import { ReservaService } from './reserva.service.js';
import { ReservaController } from './reserva.controller.js';
import { Servicios } from '../servicios/entities/servicio.entity.js';
import { Cliente } from '../clientes/entities/cliente.entity.js';
import { ReservasServicios } from '../reservas_servicios/entities/reservas_servicio.entity.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Reserva,
      Servicios,
      Cliente,
      ReservasServicios,
    ]),
  ],
  controllers: [ReservaController],
  providers: [ReservaService],
  exports: [ReservaService],
})
export class ReservaModule {}