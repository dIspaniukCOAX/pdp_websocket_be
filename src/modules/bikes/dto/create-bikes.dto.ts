import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';

export class CreateBikesDto {
  @ApiProperty()
  @IsNotEmpty({ message: i18nValidationMessage('errors.required') })
  @IsString({ message: i18nValidationMessage('errors.string') })
  model: string;

  @ApiProperty()
  @IsNotEmpty({ message: i18nValidationMessage('errors.required') })
  @IsNumber()
  latitude: number;

  @ApiProperty()
  @IsNotEmpty({ message: i18nValidationMessage('errors.required') })
  @IsNumber()
  longitude: number;

  @ApiProperty({
    type: Boolean,
    default: false,
  })
  @IsOptional()
  @IsBoolean({ message: i18nValidationMessage('errors.boolean') })
  available: boolean;

  @ApiProperty()
  @IsNotEmpty({ message: i18nValidationMessage('errors.required') })
  @IsNumber({}, { message: i18nValidationMessage('errors.number') })
  rentalPricePerHour: number;
}
