import { Entity, PrimaryGeneratedColumn, Column, ManyToMany,} from 'typeorm';
import { Reserva } from '../../reserva/entities/reserva.entity.js';

export enum Estado {
  ACTIVO = 'Activo',
  INACTIVO = 'Inactivo',
}

@Entity('servicios')
export class Servicios {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  nombre: string;

  @Column({ nullable: true })
  descripcion: string;

  @Column({ type: 'decimal'})
  precio: number;

  @Column({
    type: 'enum',
    enum: Estado,
    nullable: true,
  })
  estado: Estado;

@ManyToMany(
  () => Reserva,
  (reserva: Reserva) => reserva.servicios
)
reservas: Reserva[];
}