import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { I18nContext, I18nService } from 'nestjs-i18n';
import { FindOptionsWhere } from 'typeorm';

import { AuthHelper } from '../../auth/helpers/auth.helper';
import { User } from '../entities/user.entity';
import { UserRepository } from '../repositories/user.repository';

@Injectable()
export class UserService {
  constructor(
    private readonly i18n: I18nService,
    private readonly authHelper: AuthHelper,
    private readonly userRepository: UserRepository,
  ) {}

  async getUserProfile(userId: number): Promise<Omit<User, 'password'>> {
    const user = await this.userRepository.findUserById(userId);

    if (!user) {
      throw new HttpException(
        {
          errors: [
            {
              name: 'email',
              error: this.i18n.t('errors.userNotFound', {
                lang: I18nContext?.current()?.lang,
              }),
            },
          ],
        },
        HttpStatus.NOT_FOUND,
      );
    }

    return user;
  }

  public async findUserByParams(params: FindOptionsWhere<User>): Promise<User> {
    return this.userRepository.findUserByParams(params);
  }

  async setUserPassword(user: User, password: string): Promise<User> {
    user.password = await this.authHelper.encodePassword(password);

    return this.userRepository.saveUser(user);
  }

  public createUser(user: Partial<User>): User {
    return this.userRepository.createUser(user);
  }

  public async saveUser(user: User): Promise<User> {
    return this.userRepository.saveUser(user);
  }

  public async findUserById(userId: number): Promise<User> {
    return this.userRepository.findUserById(userId);
  }

  async decreaseBalance(userId: number, amount: number): Promise<void> {
    await this.userRepository.decrementBalance(userId, amount);
  }

  public async updateBalanceUserById(
    userId: number,
    params: Partial<User>,
  ): Promise<User> {
    const user = await this.userRepository.updateBalanceUserById(userId, params);

    return user;
  }
}
