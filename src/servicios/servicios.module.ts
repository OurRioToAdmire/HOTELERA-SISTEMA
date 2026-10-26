import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule } from '@nestjs/axios';

import { Servicios } from './entities/servicio.entity.js';
import { ServiciosService } from './servicios.service.js';
import { ServiciosController } from './servicios.controller.js';
import { ReservasServicios } from '../reservas_servicios/entities/reservas_servicio.entity.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Servicios,
      ReservasServicios,
    ]),
    HttpModule,
  ],
  controllers: [ServiciosController],
  providers: [ServiciosService],
  exports: [ServiciosService],
})
export class ServiciosModule {}