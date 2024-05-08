import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  ParseIntPipe,
  Patch,
  Delete,
} from '@nestjs/common';
import { BikesService } from '../services/bikes.service';
import { BikesDto } from '../dto/bikes.dto';
import { ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateBikesDto } from '../dto/create-bikes.dto';
import { BikeTransformer } from '../transformers/bikes.transormers';
import { UpdateBikesDto } from '../dto/update-bikes.dto';

@Controller('bikes')
@ApiTags('Bikes')
export class BikesController {
  constructor(
    private readonly bikesService: BikesService,
    private readonly bikesTransformer: BikeTransformer,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create bike' })
  @ApiOkResponse({ type: BikesDto })
  public async createBike(@Body() dto: CreateBikesDto): Promise<BikesDto> {
    const bike = await this.bikesService.createBike(dto);
    return this.bikesTransformer.transform(bike);
  }

  @Get()
  @ApiOperation({ summary: 'Get bikes' })
  @ApiOkResponse({ type: [BikesDto] })
  public async getAllBikes(): Promise<Array<BikesDto>> {
    const bikes = await this.bikesService.getBikes();

    return bikes.map(this.bikesTransformer.transform);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get bike by id' })
  @ApiOkResponse({ type: BikesDto })
  @ApiNotFoundResponse({ description: 'Bike not found' })
  public async getBikeById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<BikesDto> {
    const bike =
      await this.bikesService.findOneById(id);

    return this.bikesTransformer.transform(bike);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update bike' })
  @ApiOkResponse({
    description: 'Bike is updated',
    type: BikesDto,
  })
  @ApiNotFoundResponse({ description: 'Bike was not found' })
  public async updateBike(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateBikesDto,
  ): Promise<BikesDto> {
    const bike = await this.bikesService.updateBike(
      id,
      dto,
    );

    return this.bikesTransformer.transform(bike);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete bike' })
  @ApiOkResponse({ description: 'Bike is deleted' })
  @ApiNotFoundResponse({ description: 'Bike was not found' })
  public async deleteBikeById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<void> {
    await this.bikesService.deleteBikeById(id);
  }
}
