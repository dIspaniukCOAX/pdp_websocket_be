import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { I18nContext, I18nService } from 'nestjs-i18n';

import { User } from '../../user/entities/user.entity';
import { UserRepository } from '../../user/repositories/user.repository';
import { ITokenPayload } from '../types/action-token-payload.type';

@Injectable()
export class AuthHelper {
  constructor(
    private readonly jwt: JwtService,
    private readonly userRepository: UserRepository,
    private readonly configService: ConfigService,
    private readonly i18n: I18nService,
  ) {}

  public async decode(token: string): Promise<unknown> {
    return this.jwt.decode(token, null);
  }

  public async validateUser(decoded: any): Promise<User> {
    return this.userRepository.findUserById(decoded.id);
  }

  public async generateTokenPair(
    user: User,
  ): Promise<{ jwtToken: string; refreshToken: string }> {
    const accessTokenSecret: string =
      this.configService.get<string>('SECRET_KEY');
    const refreshTokenSecret: string =
      this.configService.get<string>('SECRET_REFRESH_KEY');

    const accessToken = await this.jwt.signAsync(
      { id: user.id },
      {
        secret: accessTokenSecret,
        expiresIn: '4h',
      },
    );
    const refreshToken = await this.jwt.signAsync(
      { id: user.id },
      {
        secret: refreshTokenSecret,
        expiresIn: '30d',
      },
    );

    return {
      jwtToken: accessToken,
      refreshToken,
    };
  }

  public generateForgotActionToken(payload: ITokenPayload) {
    return this.jwt.sign(payload, {
      expiresIn: '24h',
      secret: this.configService.get<string>('JWT_FORGOT_ACTION_SECRET'),
    });
  }

  public async verifyForgotActionToken(token: string): Promise<ITokenPayload> {
    try {
      const payload = await this.jwt.verifyAsync(token, {
        secret: this.configService.get<string>('JWT_FORGOT_ACTION_SECRET'),
      });

      return payload;
    } catch (e) {
      throw new BadRequestException({
        errors: [
          {
            error: this.i18n.t('errors.invalidForgotPasswordToken', {
              lang: I18nContext?.current()?.lang,
            }),
          },
        ],
      });
    }
  }

  public async verifyRefreshToken(token: string): Promise<ITokenPayload> {
    try {
      const payload = await this.jwt.verifyAsync(token, {
        secret: this.configService.get<string>('SECRET_REFRESH_KEY'),
      });

      return payload;
    } catch (e) {
      throw new BadRequestException({
        errors: [
          {
            error: this.i18n.t('errors.invalidRefreshToken', {
              lang: I18nContext?.current()?.lang,
            }),
          },
        ],
      });
    }
  }

  public async isPasswordValid(
    password: string,
    userPassword: string,
  ): Promise<boolean> {
    return bcrypt.compare(password, userPassword);
  }

  public async encodePassword(password: string): Promise<string> {
    const salt: string = await bcrypt.genSalt(
      +this.configService.get<string>('SECRET_SALT'),
    );

    return bcrypt.hash(password, salt);
  }

  public async validate(token: string): Promise<boolean | never> {
    const decoded: User = this.jwt.verify(token);

    if (!decoded) {
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    }

    const user: User = await this.validateUser(decoded);

    if (!user) {
      throw new UnauthorizedException();
    }

    return true;
  }
}
