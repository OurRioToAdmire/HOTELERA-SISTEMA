import { Test, TestingModule } from '@nestjs/testing';
import { ServicioReservaService } from './reserva.service.js';

describe('ServicioReservaService', () => {
  let service: ServicioReservaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ServicioReservaService],
    }).compile();

    service = module.get<ServicioReservaService>(ServicioReservaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
