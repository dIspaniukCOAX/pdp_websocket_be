import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { I18nContext, I18nService } from 'nestjs-i18n';

import { EmailService } from '../../email/services/email.service';
import { User } from '../../user/entities/user.entity';
import { UserService } from '../../user/services/user.service';
import { ForgotPasswordDto } from '../dto/forgot-password.dto';
import { LoginDto } from '../dto/login.dto';
import { RegisterDto } from '../dto/register.dto';
import { SetNewPasswordDto } from '../dto/set-new-password.dto';
import { UserTokenDto } from '../dto/user-token.dto';
import { AuthHelper } from '../helpers/auth.helper';
import {
  SocialNetworkUserDataStrategyInterface,
  SocialProfileData,
} from '../interfaces/social-network.interface';
import { ITokenPayload } from '../types/action-token-payload.type';
import { AuthCacheService } from './auth-cache.service';

@Injectable()
export class AuthService {
  private readonly appClientUrl: string;

  constructor(
    private readonly i18n: I18nService,
    private readonly authHelper: AuthHelper,
    private readonly userService: UserService,
    private readonly authCacheService: AuthCacheService,
    private readonly emailService: EmailService,
    private readonly configService: ConfigService,
  ) {
    this.appClientUrl = this.configService.get<string>('APP_CLIENT_URL');
  }

  public async register(body: RegisterDto): Promise<UserTokenDto> {
    const { email, password, ...rest }: RegisterDto = body;
    let user: User = await this.userService.findUserByParams({
      email,
    });

    if (user) {
      throw new BadRequestException({
        errors: [
          {
            name: 'email',
            error: this.i18n.t('errors.emailInUse', {
              lang: I18nContext?.current()?.lang,
            }),
          },
        ],
      });
    }

    user = this.userService.createUser({
      ...rest,
      email: email.toLowerCase(),
      password: await this.authHelper.encodePassword(password),
    });

    user = await this.userService.saveUser(user);

    await this.emailService.sendRegisteredEmail(email);

    const tokensPair = await this.authHelper.generateTokenPair(user);

    await this.authCacheService.setRefreshToken(
      tokensPair.refreshToken,
      user.id,
    );

    return { ...tokensPair, user };
  }

  public async login(body: LoginDto): Promise<UserTokenDto> {
    const { email, password }: LoginDto = body;
    const user = await this.userService.findUserByParams({
      email,
    });

    if (!user) {
      throw new NotFoundException({
        errors: [
          {
            name: 'email',
            error: this.i18n.t('errors.userNotFound', {
              lang: I18nContext?.current()?.lang,
            }),
          },
        ],
      });
    }

    if (!user?.password) {
      throw new BadRequestException({
        errors: [
          {
            name: 'password',
            error: this.i18n.t('errors.invalidPassword', {
              lang: I18nContext?.current()?.lang,
            }),
          },
        ],
      });
    }

    const isPasswordValid = await this.authHelper.isPasswordValid(
      password,
      user?.password,
    );

    if (!isPasswordValid) {
      throw new BadRequestException({
        errors: [
          {
            name: 'password',
            error: this.i18n.t('errors.invalidPassword', {
              lang: I18nContext?.current()?.lang,
            }),
          },
        ],
      });
    }

    await this.emailService.sendNewLoginEmail(email);

    const tokensPair = await this.authHelper.generateTokenPair(user);

    await this.authCacheService.setRefreshToken(
      tokensPair.refreshToken,
      user.id,
    );

    return { ...tokensPair, user };
  }

  public async refresh(refreshToken: string): Promise<UserTokenDto> {
    const userIdFromCache =
      await this.authCacheService.getUserIdByRefreshToken(refreshToken);

    const tokenPayload = await this.authHelper.verifyRefreshToken(refreshToken);

    if (!userIdFromCache || tokenPayload.id !== Number(userIdFromCache)) {
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

    const user = await this.userService.findUserById(Number(userIdFromCache));

    if (!user) {
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

    await this.authCacheService.deleteRefreshToken(refreshToken);

    const tokensPair = await this.authHelper.generateTokenPair(user);

    await this.authCacheService.setRefreshToken(
      tokensPair.refreshToken,
      user.id,
    );

    return { ...tokensPair, user };
  }

  public async getOrCreateVerifiedSocialNetworkUser(
    userData: SocialProfileData,
  ): Promise<User> {
    let user = await this.userService.findUserByParams({
      email: userData.email,
    });

    if (!user) {
      user = this.userService.createUser({
        fullName: userData.fullName,
        email: userData.email.toLowerCase(),
        isEmailConfirmed: true,
      });

      await this.userService.saveUser(user);
    }

    return user;
  }

  public async signWithGoogle(
    token: string,
    strategy: SocialNetworkUserDataStrategyInterface,
    params = {},
  ): Promise<UserTokenDto> {
    const userData = await strategy.getData(token, params);

    if (!userData) {
      throw new HttpException(
        this.i18n.t('errors.invalidAuthorizationCode', {
          lang: I18nContext?.current()?.lang,
        }),
        HttpStatus.BAD_REQUEST,
      );
    }

    if (!userData?.email) {
      throw new HttpException(
        this.i18n.t('errors.cantCreateUserWithoutEmail', {
          lang: I18nContext?.current()?.lang,
        }),
        HttpStatus.BAD_REQUEST,
      );
    }

    const user = await this.getOrCreateVerifiedSocialNetworkUser(userData);

    const tokensPair = await this.authHelper.generateTokenPair(user);

    await this.authCacheService.setRefreshToken(
      tokensPair.refreshToken,
      user.id,
    );

    return { ...tokensPair, user };
  }

  public async sendPasswordRecoveryLink({
    email,
  }: ForgotPasswordDto): Promise<void> {
    const user = await this.userService.findUserByParams({
      email,
    });
    if (!user) {
      throw new NotFoundException({
        errors: [
          {
            name: 'email',
            error: this.i18n.t('errors.userNotFound', {
              lang: I18nContext?.current()?.lang,
            }),
          },
        ],
      });
    }

    await this.generateForgotTokenAndSendForgotEmail(user.id, user.email);
  }

  public async verifyForgotToken(token: string): Promise<void> {
    const userId =
      await this.authCacheService.getUserIdByPasswordRecoveryTokenFromCache(
        token,
      );

    const payload = (await this.authHelper.verifyForgotActionToken(
      token,
    )) as ITokenPayload;

    if (!userId || payload?.id !== userId) {
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

  public async setNewPassword(
    dto: SetNewPasswordDto,
    token: string,
  ): Promise<void> {
    const userId =
      await this.authCacheService.getUserIdByPasswordRecoveryTokenFromCache(
        token,
      );

    const payload = (await this.authHelper.decode(token)) as ITokenPayload;

    if (!userId || payload?.id !== userId) {
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

    const user = await this.userService.findUserByParams({
      id: +userId,
    });
    if (!user) {
      throw new NotFoundException({
        errors: [
          {
            error: this.i18n.t('errors.userNotFound', {
              lang: I18nContext?.current()?.lang,
            }),
          },
        ],
      });
    }

    await this.userService.setUserPassword(user, dto.newPassword);

    await this.authCacheService.deletePasswordRecoveryTokenFromCache(token);

    await this.emailService.sendPasswordChangedEmail(user.email);
  }

  public async resendForgotPasswordLink(token: string): Promise<void> {
    const payload = (await this.authHelper.decode(token)) as ITokenPayload;

    const user = await this.userService.findUserByParams({ id: payload.id });
    if (!user) {
      throw new NotFoundException({
        errors: [
          {
            error: this.i18n.t('errors.userNotFound', {
              lang: I18nContext?.current()?.lang,
            }),
          },
        ],
      });
    }

    await this.generateForgotTokenAndSendForgotEmail(payload.id, user.email);
  }

  public async generateForgotTokenAndSendForgotEmail(
    userId: number,
    email: string,
  ): Promise<void> {
    const jwtTokenForForgotPassword = this.authHelper.generateForgotActionToken(
      {
        id: userId,
      },
    );

    await this.authCacheService.setPasswordRecoveryTokenToCache(
      userId,
      jwtTokenForForgotPassword,
    );

    const urlForResetPassword = `${this.appClientUrl}/auth/${jwtTokenForForgotPassword}/set-new-password`;
    await this.emailService.sendForgotPasswordEmail(email, {
      RESTORE_PASSWORD_URL: urlForResetPassword,
    });
  }
}
