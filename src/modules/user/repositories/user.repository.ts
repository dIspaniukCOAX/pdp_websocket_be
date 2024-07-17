import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';

import { UpdateUser } from '../entities/updateUser.entity';
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

  public async updateUserById(
    id: number,
    user: Partial<UpdateUser>,
  ): Promise<User> {
    await this.repository.update(id, user);

    return this.findUserById(id);
  }

  public async getAllUsers(userId: number): Promise<User[]> {
    const query = this.repository.createQueryBuilder('user').where('user.id != :userId', { userId });

    return query.getMany();
  }
}
