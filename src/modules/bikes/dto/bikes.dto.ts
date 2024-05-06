import { ApiProperty } from '@nestjs/swagger';

export class BikesDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  model: string;

  @ApiProperty()
  latitude: number;
  
  @ApiProperty()
  longitude: number;

  @ApiProperty()
  available: boolean;

  @ApiProperty()
  rentalPricePerHour: number;
}
