import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { BaseEntity } from '../../../entities/base.entity';
import { ApiProperty } from '@nestjs/swagger';
import { User } from 'modules/user/entities/user.entity';
import { IsString, Matches } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';
import { REGEXP } from '../../../constants';
import { Bikes } from 'modules/bikes/entities/bikes.entity';

@Entity('Transaction')
export class Transaction extends BaseEntity {

  @Column({ type: 'float' })
  amount: number;

  @ApiProperty()
  @Column({ type: 'varchar', default: true })
  @IsString({ message: i18nValidationMessage('errors.string') })
  @Matches(REGEXP.date, {
    message: i18nValidationMessage('errors.date'),
  })
  expiresIn: string;

  @ApiProperty()
  @Column({ type: 'varchar', default: true })
  @IsString({ message: i18nValidationMessage('errors.string') })
  @Matches(REGEXP.date, {
    message: i18nValidationMessage('errors.date'),
  })
  expiresOut: string;

  @ApiProperty({ type: () => User })
  @OneToOne(() => User, (user) => user, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({
    name: 'userId',
  })
  user: User;

  @ApiProperty({ type: () => Bikes })
  @OneToOne(() => Bikes, (bike) => bike, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({
    name: 'bikeId',
  })
  bike: Bikes;

  @Column({ name: 'bikeId' })
  bikeId: number;

  @Column({ name: 'userId' })
  userId: number;
}