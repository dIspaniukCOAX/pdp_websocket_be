import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';

export class UpdateBikesDto {
  @ApiProperty()
  @IsOptional()
  @IsString({ message: i18nValidationMessage('errors.string') })
  model: string;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  latitude: number;

  @ApiProperty()
  @IsOptional()
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
  @IsOptional()
  @IsNumber({}, { message: i18nValidationMessage('errors.number') })
  rentalPricePerHour: number;
}
