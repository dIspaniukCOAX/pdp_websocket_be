import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Bikes } from '../entities/bikes.entity';

@Injectable()
export class BikesRepository {
  constructor(
    @InjectRepository(Bikes)
    private readonly repository: Repository<Bikes>,
  ) {}

  public create(data: Partial<Bikes>): Bikes {
    return this.repository.create(data);
  }

  public async find() {
    return this.repository.find({
      order: {
        id: "DESC"
      }
    });
  }

  public async save(data: Partial<Bikes>): Promise<Bikes> {
    return this.repository.save(data);
  }

  public async findOneById(id: number): Promise<Bikes> {
    return this.repository.findOne({ where: { id } });
  }

  public async updateByIdAndFind(
    id: number,
    data: Partial<Bikes>,
  ): Promise<Bikes> {
    await this.repository.update({ id }, data);

    return this.findOneById(id);
  }

  public async deleteById(id: number): Promise<void> {
    await this.repository.delete({ id });
  }
}
