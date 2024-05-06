import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { Column, Entity, Unique } from 'typeorm';

import { BaseEntity } from '../../../entities/base.entity';

@Entity('User')
export class User extends BaseEntity {
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

  @ApiProperty()
  @Column({ type: 'float', nullable: false })
  balance: number;

  @ApiProperty()
  @Column({ type: 'boolean', nullable: true })
  isEmailConfirmed: boolean;

  @Column({ type: 'varchar', nullable: true })
  @Exclude()
  password: string;
}
