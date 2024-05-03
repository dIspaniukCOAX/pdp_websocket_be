import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, Matches } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';

import { REGEXP } from '../constants';

export class DateFilterDto {
  @ApiPropertyOptional({ type: String })
  @IsString({ message: i18nValidationMessage('errors.string') })
  @IsOptional()
  @Matches(REGEXP.date, {
    message: i18nValidationMessage('errors.date'),
  })
  fromDate: string;

  @ApiPropertyOptional({ type: String })
  @IsString({ message: i18nValidationMessage('errors.string') })
  @IsOptional()
  @Matches(REGEXP.date, {
    message: i18nValidationMessage('errors.date'),
  })
  toDate: string;
}
