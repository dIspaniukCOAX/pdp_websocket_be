import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';

export class GoogleAuthDto {
  @ApiProperty({
    type: String,
    description: 'The authorization code from Google',
    example: '4/0AY0e-g7Rk8q3H4Q0m6cY4q4s1JvY5K3aQZq4n7jYy0o2q4y0',
  })
  @IsNotEmpty({ message: i18nValidationMessage('errors.required') })
  authorizationCode: string;
}
