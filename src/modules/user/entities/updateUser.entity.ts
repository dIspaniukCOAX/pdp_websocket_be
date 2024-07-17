import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, Unique } from 'typeorm';

import { BaseEntity } from '../../../entities/base.entity';

@Entity('User')
export class UpdateUser extends BaseEntity {
  @ApiProperty()
  @Column({ type: 'varchar' })
  @Unique(['email'])
  email: string;

  @ApiProperty()
  @Column({ type: 'varchar', nullable: true })
  phoneNumber: string;

  @ApiProperty()
  @Column({ type: 'varchar', nullable: true })
  fullName: string;
}
