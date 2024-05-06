import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BikesService } from './services/bikes.service';
import { Bikes } from './entities/bikes.entity';
import { BikesController } from './controllers/bikes.controller';
import { BikeTransformer } from './transformers/bikes.transormers';
import { BikesRepository } from './repositories/bikes.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Bikes])],
  controllers: [BikesController],
  providers: [BikesService, BikesRepository, BikeTransformer],
  exports: [BikesService, BikesRepository, BikeTransformer],
})
export class BikesModule {}
