import { ApiProperty } from '@nestjs/swagger';

import { User } from '../../user/entities/user.entity';

export class UserTokenDto {
  @ApiProperty({
    description: 'User data',
    type: () => User,
  })
  user: object;

  @ApiProperty({
    description: 'JWT token',
    type: String,
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9',
  })
  jwtToken: string;

  @ApiProperty({
    description: 'Refresh token',
    type: String,
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9',
  })
  refreshToken: string;
}
