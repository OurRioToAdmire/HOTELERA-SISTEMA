import { Test, TestingModule } from '@nestjs/testing';
import { ReservasServiciosController } from './reservas_servicios.controller.js';
import { ReservasServiciosService } from './reservas_servicios.service.js';

describe('ReservasServiciosController', () => {
  let controller: ReservasServiciosController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReservasServiciosController],
      providers: [ReservasServiciosService],
    }).compile();

    controller = module.get<ReservasServiciosController>(ReservasServiciosController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
