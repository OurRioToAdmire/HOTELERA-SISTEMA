import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ClientesService } from './clientes.service.js';
import { ClientesController } from './clientes.controller.js';
import { Cliente } from './entities/cliente.entity.js';
import { Reserva } from '../reserva/entities/reserva.entity.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Cliente,
      Reserva,
    ]),
  ],
  controllers: [ClientesController],
  providers: [ClientesService],
  exports: [ClientesService],
})
export class ClientesModule {}