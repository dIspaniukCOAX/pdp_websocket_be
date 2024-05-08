import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Bikes } from '../entities/bikes.entity';
import { BikesRepository } from '../repositories/bikes.repository';
import { CreateBikesDto } from '../dto/create-bikes.dto';
import { UpdateBikesDto } from '../dto/update-bikes.dto';

@Injectable()
export class BikesService {
  constructor(
    @InjectRepository(Bikes)
    private bikesRepository: BikesRepository,
  ) {}

  async createBike(dto: CreateBikesDto): Promise<Bikes> {
    const bike = this.bikesRepository.create(dto);
    return this.bikesRepository.save(bike);
  }

  async getBikes(): Promise<Bikes[]> {
    const bikes = await this.bikesRepository.find();
    return bikes;
  }

  async findOneById(id: number): Promise<Bikes> {
    const bike = await this.bikesRepository.findOneById(id);

    if (!bike) {
      throw new NotFoundException('Bike not found');
    }

    return bike;
  }

  async updateBike(id: number, dto: UpdateBikesDto): Promise<Bikes> {
    await this.findOneById(id);
    await this.bikesRepository.update(id, dto);
    return this.findOneById(id);
  }

  public async deleteBikeById(id: number): Promise<void> {
    await this.findOneById(id);

    await this.bikesRepository.deleteById(id);
  }
}