import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';

import { User } from '../entities/user.entity';

export class UserRepository {
  constructor(
    @InjectRepository(User)
    private readonly repository: Repository<User>,
  ) {}

  createUser(user: Partial<User>): User {
    return this.repository.create(user);
  }

  async saveUser(user: User): Promise<User> {
    return this.repository.save(user);
  }

  async findUserByEmail(email: string): Promise<User | null> {
    if (!email) return null;

    return this.repository.findOneBy({ email: email?.toLowerCase() });
  }

  async findUserById(id: number): Promise<User | null> {
    if (!id) return null;

    return this.repository.findOneBy({ id });
  }

  public async findUserByParams(params: FindOptionsWhere<User>) {
    return this.repository.findOne({ where: params });
  }

  public async findUserByParamsWithHotel(params: FindOptionsWhere<User>) {
    return this.repository.findOne({
      where: params,
    });
  }

  public async updateBalanceUserById(
    userId: number,
    params: Partial<User>,
  ): Promise<User> {
    const user = await this.repository.findOneBy({ id: userId });
    const balance = user.balance + params.balance;

    await this.repository.update(userId, {
      balance
    });

    return this.repository.findOneBy({ id: userId });
  }
}
