import { Test, TestingModule } from '@nestjs/testing';
import { ReservasServiciosService } from './reservas_servicios.service.js';

describe('ReservasServiciosService', () => {
  let service: ReservasServiciosService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ReservasServiciosService],
    }).compile();

    service = module.get<ReservasServiciosService>(ReservasServiciosService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
