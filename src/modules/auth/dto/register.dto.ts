import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
  MinLength,
  Validate,
} from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';

import { REGEXP } from '../../../constants';
import { PhoneNumberValidator } from '../../../validators/phone-number.validator';

export class RegisterDto {
  @ApiProperty({
    type: String,
    description: 'The email of the user',
    example: 'johndoe@gmail.com',
  })
  @IsNotEmpty({ message: i18nValidationMessage('errors.required') })
  @IsEmail({}, { message: i18nValidationMessage('errors.email') })
  email: string;

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
  password: string;

  @ApiProperty({
    type: String,
    description: "The user's full name",
    example: 'John Doe',
  })
  @IsNotEmpty({ message: i18nValidationMessage('errors.required') })
  @IsString({ message: i18nValidationMessage('errors.string') })
  fullName: string;

  @ApiProperty({
    type: String,
    description: 'The phone number of the user',
    example: '+380661234567',
  })
  @IsNotEmpty({ message: i18nValidationMessage('errors.required') })
  @IsString({ message: i18nValidationMessage('errors.string') })
  @Validate(PhoneNumberValidator)
  phoneNumber: string;
}
