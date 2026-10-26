import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule } from '@nestjs/axios';

import { ReservasServicios } from './entities/reservas_servicio.entity.js';
import { ReservasServiciosService } from './reservas_servicios.service.js';
import { ReservasServiciosController } from './reservas_servicios.controller.js';
import { Reserva } from '../reserva/entities/reserva.entity.js';
import { Servicios } from '../servicios/entities/servicio.entity.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ReservasServicios,
      Reserva,
      Servicios,
    ]),
    HttpModule,
  ],
  controllers: [ReservasServiciosController],
  providers: [ReservasServiciosService],
  exports: [ReservasServiciosService],
})
export class ReservasServiciosModule {}