import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  ParseIntPipe,
  Patch,
} from '@nestjs/common';
import { TransactionService } from '../services/transaction.service';
import { TransactionDto } from '../dto/transaction.dto';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateTransactionDto } from '../dto/create-transaction.dto';
import { TransactionTransformer } from '../transformers/transaction.transormers';
import { GetUser } from 'decorators/user.decorator';
import { User } from 'modules/user/entities/user.entity';
import { UserService } from 'modules/user/services/user.service';
import { BikesService } from 'modules/bikes/services/bikes.service';
import { Bikes } from 'modules/bikes/entities/bikes.entity';

@Controller('transaction')
@ApiTags('Transaction')
export class TransactionController {
  constructor(
    private readonly transactionService: TransactionService,
    private readonly transactionTransformer: TransactionTransformer,
    private readonly userService: UserService,
    private readonly bikeService: BikesService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create transaction' })
  @ApiOkResponse({ type: TransactionDto })
  public async createTransaction(
    @Body() dto: TransactionDto,
    @GetUser() user: User,
  ) {
    const transaction = await this.transactionService.createTransaction(dto);
    await this.userService.decreaseBalance(user.id, dto.amount);

    const bike = await this.bikeService.findOneById(dto.bikeId);
    if (bike) {
      await this.bikeService.updateBike(dto.bikeId, {
        ...bike,
        available: false,
      });
    }

    return this.transactionTransformer.transform(transaction);
  }

  @Get()
  @ApiOperation({ summary: 'Get transactions' })
  @ApiOkResponse({ type: [TransactionDto] })
  public async getAllTransactions(): Promise<Array<TransactionDto>> {
    const transactions = await this.transactionService.find();

    return transactions.map(this.transactionTransformer.transform);
  }

  @Get(':userId')
  @ApiOperation({ summary: 'Get user transactions' })
  @ApiOkResponse({ type: [TransactionDto] })
  public async getUserTransaction(
    @Param('userId', ParseIntPipe) userId: number,
  ): Promise<TransactionDto[]> {
    const transactions = await this.transactionService.findByUserId(userId);
    
    return transactions.map(this.transactionTransformer.transform);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update transaction' })
  @ApiOkResponse({ type: TransactionDto })
  public async updateTransaction(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: TransactionDto,
  ): Promise<TransactionDto> {
    const transaction = await this.transactionService.update(id, dto);

    return this.transactionTransformer.transform(transaction);
  }
}
