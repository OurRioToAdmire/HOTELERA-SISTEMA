import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule } from '@nestjs/axios';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { ClientesModule } from './clientes/clientes.module.js';
import { ServiciosModule } from './servicios/servicios.module.js';
import { ReservaModule } from './reserva/reserva.module.js';
import { ReservasServiciosModule } from './reservas_servicios/reservas_servicios.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'mysql' as const,
        host: config.get<string>('APP_HOST'),
        port: Number(config.get<string>('APP_PORT') ?? 3306),
        username: config.get<string>('APP_USERNAME'),
        password: config.get<string>('APP_PASSWORD'),
        database: config.get<string>('APP_DATABASE'),
        autoLoadEntities: true,
        synchronize: true
      }),
    }),

    HttpModule,
    ClientesModule,
    ServiciosModule,
    ReservaModule,
    ReservasServiciosModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}