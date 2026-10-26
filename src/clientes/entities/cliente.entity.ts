import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Reserva } from '../../reserva/entities/reserva.entity.js';

@Entity('clientes')
export class Cliente {

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 2253 })
  nombre: string;

  @Column({ type: 'varchar', nullable: false })
  apellido: string;

  @Column({type: 'varchar', nullable: false,
    length: 10
   })
  telefono: string;

  @Column({ type: 'varchar', nullable: false })
  correo: string;

  @OneToMany(() => Reserva, (reserva) => reserva.clienteId)
  reservas: Reserva[];
}