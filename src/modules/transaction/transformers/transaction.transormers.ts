import { Injectable } from '@nestjs/common';
import { Transaction } from '../entities/transaction.entity';
import { TransactionDto } from '../dto/transaction.dto';

@Injectable()
export class TransactionTransformer {
  constructor() {
    this.transform = this.transform.bind(this);
  }

  transform(transaction: Transaction): TransactionDto {
    return {
      id: transaction.id,
      amount: transaction.amount,
      expiresIn: transaction.expiresIn,
      expiresOut: transaction.expiresOut,
      userId: transaction.userId,
      bikeId: transaction.bikeId,
    };
  }
}