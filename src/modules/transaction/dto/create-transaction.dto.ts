import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsString,
} from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';

export class CreateTransactionDto {
  @ApiProperty()
  @IsNotEmpty({ message: i18nValidationMessage('errors.required') })
  @IsString({ message: i18nValidationMessage('errors.string') })
  expiresIn: string;

  @ApiProperty()
  @IsNotEmpty({ message: i18nValidationMessage('errors.required') })
  @IsNumber()
  amount: number;

  @ApiProperty()
  @IsNotEmpty({ message: i18nValidationMessage('errors.required') })
  @IsString()
  expiresOut: string;
}
