import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Transaction } from '../entities/transaction.entity';
import { TransactionRepository } from '../repositories/transaction.repository';
import { CreateTransactionDto } from '../dto/create-transaction.dto';
import { BikesService } from 'modules/bikes/services/bikes.service';
import { TransactionDto } from '../dto/transaction.dto';

@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(Transaction)
    private transactionRepository: TransactionRepository,
    private readonly bikeService: BikesService,
  ) {}

  async createTransaction(dto: CreateTransactionDto): Promise<Transaction> {
    const transaction = this.transactionRepository.create(dto);
    return this.transactionRepository.save(transaction);
  }

  async find(): Promise<Transaction[]> {
    const transactions = await this.transactionRepository.find();
    return transactions;
  }

  async findByUserId(userId: number): Promise<Transaction[]> {
    const now = new Date().toISOString();
    const transactions = await this.transactionRepository.find({
      where: { userId }
    });
    const userActiveTransactions = transactions.filter(transaction =>
      transaction.expiresIn <= now &&
      transaction.expiresOut > now
    );

    if (!userActiveTransactions.length) {
      await Promise.all(transactions.map(async (transaction) => {
        const bike = await this.bikeService.findOneById(transaction.bikeId);
        return this.bikeService.updateBike(transaction.bikeId, { 
          ...bike,
          available: true 
        });
      }));
    }
  
    return userActiveTransactions;
  }

  async findOneById (id: number): Promise<Transaction> {
    const transaction = await this.transactionRepository.findOneById(id);
    if (!transaction) {
      throw new NotFoundException('Transaction not found');
    }

    return transaction;
  }

  async update (id: number, dto: TransactionDto): Promise<Transaction> {
    const transaction = await this.transactionRepository.findOneById(id);
    if (!transaction) {
      throw new NotFoundException('Transaction not found');
    }

    const updatedTransaction = await this.transactionRepository.save({
      ...transaction,
      ...dto
    });

    return updatedTransaction;
  }
}