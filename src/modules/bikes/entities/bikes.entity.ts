import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../../entities/base.entity';

@Entity('Bikes')
export class Bikes extends BaseEntity {
  @Column({ type: 'varchar' })
  model: string;

  @Column({ type: 'float' })
  latitude: number;

  @Column({ type: 'float' })
  longitude: number;

  @Column({ type: 'boolean', default: true })
  available: boolean;

  @Column({ type: 'float' })
  rentalPricePerHour: number;
}