import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Matches, MinLength } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';

import { REGEXP } from '../../../constants';

export class SetNewPasswordDto {
  @ApiProperty({
    type: String,
    description: 'The password of the user',
    example: 'superSecurePassword123',
  })
  @IsNotEmpty({ message: i18nValidationMessage('errors.required') })
  @IsString({ message: i18nValidationMessage('errors.password') })
  @MinLength(8, { message: i18nValidationMessage('errors.password') })
  @Matches(REGEXP.password, {
    message: i18nValidationMessage('errors.password'),
  })
  newPassword: string;
}
