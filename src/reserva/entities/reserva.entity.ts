import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable, } from 'typeorm';
import { Servicios } from '../../servicios/entities/servicio.entity.js';

export enum Estado {
  CANCELADO = 'cancelado',
  ATENDIDO = 'atendido',
  RESERVADA = 'reservada',
}

@Entity('servicio_reserva')
export class Reserva {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int', nullable: false })
  clienteId: number;

  @Column({ type: 'int', nullable: false })
  habitacionId: number;

  @ManyToMany(
    () => Servicios,
    (servicio: Servicios) => servicio.reservas,
  )
  @JoinTable()
  servicios: Servicios[];

  @Column({ type: 'date', nullable: false })
  fechastart: Date;

  @Column({ type: 'date', nullable: false })
  fechaend: Date;

  @Column({ type: 'time', nullable: false })
  checkin: string;

  @Column({ type: 'time', nullable: false })
  checkout: string;

  @Column({ type: 'int', nullable: false })
  huespuedes: number;

  @Column({
    type: 'enum',
    enum: Estado,
    nullable: false,
    default: Estado.RESERVADA,
  })
  estado: Estado;
}