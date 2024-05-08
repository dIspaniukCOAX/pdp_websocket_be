import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LessThan, MoreThanOrEqual, Repository } from 'typeorm';
import { Transaction } from '../entities/transaction.entity';

@Injectable()
export class TransactionRepository {
  constructor(
    @InjectRepository(Transaction)
    private readonly repository: Repository<Transaction>,
  ) {}

  public create(data: Partial<Transaction>): Transaction {
    return this.repository.create(data);
  }

  public async find(params?: any) {
    return this.repository.find({
      order: {
        id: "DESC"
      },
      ...params
    });
  }

  public async save(data: Partial<Transaction>): Promise<Transaction> {
    return this.repository.save(data);
  }

  public async findOneById(params?: any): Promise<Transaction> {
    return this.repository.findOne({ ...params });
  }
}
