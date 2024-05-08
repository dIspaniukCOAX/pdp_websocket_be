import { Module } from '@nestjs/common';
import { TransactionService } from './services/transaction.service';
import { TransactionController } from './controllers/transaction.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transaction } from './entities/transaction.entity';
import { TransactionRepository } from './repositories/transaction.repository';
import { TransactionTransformer } from './transformers/transaction.transormers';
import { UserModule } from 'modules/user/user.module';
import { BikesModule } from 'modules/bikes/bikes.module';

@Module({
  imports: [TypeOrmModule.forFeature([Transaction]), UserModule, BikesModule],
  controllers: [TransactionController],
  providers: [
    TransactionService,
    TransactionRepository,
    TransactionTransformer,
  ],
  exports: [TransactionService, TransactionRepository, TransactionTransformer],
})
export class TransactionModule {}
