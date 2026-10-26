import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('reservas_servicios')
export class ReservasServicios {
  @PrimaryGeneratedColumn()
  reservasServiciosId: number;

  @Column({ type: 'int', nullable: false })
  reservaId: number;

  @Column({ type: 'int', nullable: false })
  servicioId: number;

  @Column({ type: 'varchar', nullable: false })
  descripcion: string;
}