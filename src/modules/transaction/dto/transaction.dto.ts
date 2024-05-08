import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';

export class TransactionDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  @IsString({ message: i18nValidationMessage('errors.string') })
  expiresIn: string;

  @ApiProperty()
  @IsString({ message: i18nValidationMessage('errors.string') })
  expiresOut: string;
  
  @ApiProperty()
  userId: number;

  @ApiProperty()
  bikeId: number;

  @ApiProperty()
  amount: number;
}
