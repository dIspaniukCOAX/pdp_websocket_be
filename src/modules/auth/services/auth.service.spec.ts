import { faker } from '@faker-js/faker';
import {
  BadRequestException,
  HttpException,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { I18nService } from 'nestjs-i18n';

import authHelperMock from '../../../mocks/auth.helper.mock';
import authCacheServiceMock from '../../../mocks/auth-cache.service.mock';
import configServiceMock from '../../../mocks/config.service.mock';
import emailServiceMock from '../../../mocks/email.service.mock';
import i18nServiceMock from '../../../mocks/i18n.service.mock';
import userServiceMock from '../../../mocks/user.service.mock';
import { EmailService } from '../../email/services/email.service';
import { User } from '../../user/entities/user.entity';
import { UserService } from '../../user/services/user.service';
import { ForgotPasswordDto } from '../dto/forgot-password.dto';
import { RegisterDto } from '../dto/register.dto';
import { SetNewPasswordDto } from '../dto/set-new-password.dto';
import { AuthHelper } from '../helpers/auth.helper';
import { AuthService } from './auth.service';
import { AuthCacheService } from './auth-cache.service';

describe('AuthService', () => {
  let authService: AuthService;
  let userService: UserService;
  let authHelper: AuthHelper;
  let authCacheService: AuthCacheService;
  let emailService: EmailService;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [],
      providers: [
        AuthService,
        {
          provide: I18nService,
          useFactory: i18nServiceMock,
        },
        {
          provide: AuthHelper,
          useFactory: authHelperMock,
        },
        {
          provide: UserService,
          useFactory: userServiceMock,
        },
        {
          provide: AuthCacheService,
          useFactory: authCacheServiceMock,
        },
        { provide: EmailService, useFactory: emailServiceMock },
        {
          provide: ConfigService,
          useFactory: configServiceMock,
        },
      ],
    }).compile();

    authService = moduleRef.get<AuthService>(AuthService);
    userService = moduleRef.get<UserService>(UserService);
    authHelper = moduleRef.get<AuthHelper>(AuthHelper);
    authCacheService = moduleRef.get<AuthCacheService>(AuthCacheService);
    emailService = moduleRef.get<EmailService>(EmailService);
  });

  it('AuthService - should be defined', () => {
    expect(authService).toBeDefined();
  });

  describe('login', () => {
    it('should throw NotFound when user is not found', async () => {
      const loginDto = {
        email: faker.internet.email(),
        password: faker.internet.password(),
      };

      jest.spyOn(userService, 'findUserByParams').mockResolvedValue(null);

      try {
        await authService.login(loginDto);
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
      }
    });

    it('should throw BadRequest when password is invalid', async () => {
      const email = faker.internet.email();
      const password = faker.internet.password();
      const loginDto = { email, password };
      const user = { id: faker.number.int(), email, password };

      jest
        .spyOn(userService, 'findUserByParams')
        .mockResolvedValue(user as User);
      jest.spyOn(authHelper, 'isPasswordValid').mockResolvedValue(false);

      try {
        await authService.login(loginDto);
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
      }
    });

    it('should send new login email and return user token on successful login', async () => {
      const jwtToken = faker.string.sample();
      const refreshToken = faker.string.sample();
      const email = faker.internet.email();
      const password = faker.internet.password();
      const loginDto = { email, password };
      const user = { id: faker.number.int(), email, password };

      jest
        .spyOn(userService, 'findUserByParams')
        .mockResolvedValue(user as User);
      jest.spyOn(authHelper, 'isPasswordValid').mockResolvedValue(true);
      jest.spyOn(emailService, 'sendNewLoginEmail').mockResolvedValue(null);
      jest
        .spyOn(authHelper, 'generateTokenPair')
        .mockResolvedValueOnce({ jwtToken, refreshToken });
      jest
        .spyOn(authCacheService, 'setRefreshToken')
        .mockResolvedValueOnce(null);

      const result = await authService.login(loginDto);

      expect(result.jwtToken).toEqual(jwtToken);
      expect(emailService.sendNewLoginEmail).toHaveBeenCalledWith(email);
      expect(authCacheService.setRefreshToken).toHaveBeenCalledWith(
        refreshToken,
        user.id,
      );
    });
  });

  describe('register', () => {
    it('should throw BadRequest when email is already in use', async () => {
      const email = faker.internet.email();
      const password = faker.internet.password();
      const registerDto = {
        email,
        password,
      };

      jest.spyOn(userService, 'findUserByParams').mockResolvedValue({
        id: faker.number.int(),
        email,
      } as User);

      await expect(
        authService.register(registerDto as RegisterDto),
      ).rejects.toThrow(BadRequestException);
    });

    it('should register a new user and return user token', async () => {
      const email = faker.internet.email();
      const password = faker.internet.password();
      const jwtToken = faker.string.sample();
      const refreshToken = faker.string.sample();

      const registerDto = {
        email,
        password,
      };

      const user = { id: faker.number.int(), email, password };

      jest.spyOn(userService, 'findUserByParams').mockResolvedValue(null);
      jest
        .spyOn(userService, 'createUser')
        .mockReturnValueOnce(registerDto as any);
      jest.spyOn(userService, 'saveUser').mockResolvedValueOnce(user as User);
      jest
        .spyOn(authHelper, 'encodePassword')
        .mockResolvedValue(faker.string.sample());
      jest.spyOn(emailService, 'sendRegisteredEmail').mockResolvedValue(null);
      jest
        .spyOn(authHelper, 'generateTokenPair')
        .mockResolvedValueOnce({ jwtToken, refreshToken });

      const result = await authService.register(registerDto as RegisterDto);

      expect(result.jwtToken).toEqual(jwtToken);
      expect(userService.createUser).toHaveBeenCalled();
      expect(userService.saveUser).toHaveBeenCalled();
      expect(emailService.sendRegisteredEmail).toHaveBeenCalledWith(email);
    });
  });

  describe('sendPasswordRecoveryLink', () => {
    it('should throw HttpException when user is not found', async () => {
      const email = faker.internet.email();
      const forgotPasswordDto: ForgotPasswordDto = { email };

      jest.spyOn(userService, 'findUserByParams').mockResolvedValue(null);

      await expect(
        authService.sendPasswordRecoveryLink(forgotPasswordDto),
      ).rejects.toThrowError(HttpException);

      expect(userService.findUserByParams).toHaveBeenCalledWith({ email });
    });

    it('should send password recovery link', async () => {
      const email = faker.internet.email();
      const forgotPasswordDto: ForgotPasswordDto = { email };
      const user = { id: faker.number.int() };
      const jwtToken = faker.string.sample();

      jest
        .spyOn(userService, 'findUserByParams')
        .mockResolvedValue(user as User);
      jest
        .spyOn(authHelper, 'generateForgotActionToken')
        .mockReturnValueOnce(jwtToken);

      await authService.sendPasswordRecoveryLink(forgotPasswordDto);

      expect(userService.findUserByParams).toHaveBeenCalledWith({ email });
      expect(authHelper.generateForgotActionToken).toHaveBeenCalledWith({
        id: user.id,
      });
    });
  });

  describe('setNewPassword', () => {
    it('should throw BadRequestException when token is invalid', async () => {
      const token = faker.string.sample();
      const dto: SetNewPasswordDto = { newPassword: faker.string.sample() };

      jest
        .spyOn(authCacheService, 'getUserIdByPasswordRecoveryTokenFromCache')
        .mockResolvedValue(null);

      await expect(authService.setNewPassword(dto, token)).rejects.toThrowError(
        BadRequestException,
      );
    });

    it('should throw NotFoundException when user is not found', async () => {
      const token = faker.string.sample();
      const userId = faker.number.int();
      const dto: SetNewPasswordDto = { newPassword: faker.string.sample() };

      jest
        .spyOn(authCacheService, 'getUserIdByPasswordRecoveryTokenFromCache')
        .mockResolvedValue(userId);
      jest.spyOn(authHelper, 'decode').mockResolvedValue({ id: userId });
      jest.spyOn(userService, 'findUserByParams').mockResolvedValue(null);

      await expect(authService.setNewPassword(dto, token)).rejects.toThrowError(
        NotFoundException,
      );
      expect(userService.findUserByParams).toHaveBeenCalledWith({
        id: +userId,
      });
    });

    it('should set new password and delete token', async () => {
      const token = faker.string.sample();
      const userId = faker.number.int();
      const dto: SetNewPasswordDto = { newPassword: faker.string.sample() };
      const user = { id: userId };

      jest
        .spyOn(authCacheService, 'getUserIdByPasswordRecoveryTokenFromCache')
        .mockResolvedValueOnce(userId);
      jest
        .spyOn(userService, 'findUserByParams')
        .mockResolvedValueOnce(user as User);
      jest
        .spyOn(authCacheService, 'deletePasswordRecoveryTokenFromCache')
        .mockResolvedValueOnce(null);
      jest.spyOn(authHelper, 'decode').mockResolvedValueOnce(user);

      await authService.setNewPassword(dto, token);

      expect(userService.findUserByParams).toHaveBeenCalledWith({
        id: +userId,
      });
      expect(userService.setUserPassword).toHaveBeenCalledWith(
        user,
        dto.newPassword,
      );
      expect(
        authCacheService.deletePasswordRecoveryTokenFromCache,
      ).toHaveBeenCalledWith(token);
    });
  });

  describe('verifyForgotToken', () => {
    it('should verify a valid forgot password token', async () => {
      const userId = faker.number.int();
      const token = faker.string.sample();

      jest
        .spyOn(authCacheService, 'getUserIdByPasswordRecoveryTokenFromCache')
        .mockResolvedValue(userId);
      jest
        .spyOn(authHelper, 'verifyForgotActionToken')
        .mockResolvedValue({ id: userId });

      await expect(
        authService.verifyForgotToken(token),
      ).resolves.toBeUndefined();

      expect(
        authCacheService.getUserIdByPasswordRecoveryTokenFromCache,
      ).toHaveBeenCalledWith(token);
      expect(authHelper.verifyForgotActionToken).toHaveBeenCalledWith(token);
    });

    it('should throw BadRequestException for if token payload does not match to cache', async () => {
      const userId = faker.number.int();
      const token = faker.string.sample();

      jest
        .spyOn(authCacheService, 'getUserIdByPasswordRecoveryTokenFromCache')
        .mockResolvedValue(userId);
      jest
        .spyOn(authHelper, 'verifyForgotActionToken')
        .mockResolvedValue({ id: faker.number.int() });

      await expect(authService.verifyForgotToken(token)).rejects.toThrowError(
        BadRequestException,
      );

      expect(
        authCacheService.getUserIdByPasswordRecoveryTokenFromCache,
      ).toHaveBeenCalledWith(token);
      expect(authHelper.verifyForgotActionToken).toHaveBeenCalledWith(token);
    });

    it('should throw BadRequestException for an invalid forgot password token', async () => {
      const userId = faker.number.int();
      const token = faker.string.sample();

      jest
        .spyOn(authCacheService, 'getUserIdByPasswordRecoveryTokenFromCache')
        .mockResolvedValue(userId);
      jest
        .spyOn(authHelper, 'verifyForgotActionToken')
        .mockRejectedValue(new BadRequestException());

      await expect(authService.verifyForgotToken(token)).rejects.toThrowError(
        BadRequestException,
      );
    });
  });

  describe('resendForgotPasswordLink', () => {
    it('should throw NotFoundException if user not found', async () => {
      const token = faker.string.sample();

      jest
        .spyOn(authHelper, 'decode')
        .mockResolvedValueOnce({ id: faker.number.int() });
      jest.spyOn(userService, 'findUserByParams').mockResolvedValueOnce(null);

      await expect(
        authService.resendForgotPasswordLink(token),
      ).rejects.toThrowError(NotFoundException);
    });

    it('should generate forgot token and send forgot email', async () => {
      const token = faker.string.sample();
      const userId = faker.number.int();

      const decodedPayload = { id: userId };
      const user = { id: userId, email: faker.internet.email() };

      jest.spyOn(authHelper, 'decode').mockResolvedValue(decodedPayload);
      jest
        .spyOn(userService, 'findUserByParams')
        .mockResolvedValueOnce(user as User);
      jest.spyOn(authService, 'generateForgotTokenAndSendForgotEmail');

      await authService.resendForgotPasswordLink(token);

      expect(
        authService.generateForgotTokenAndSendForgotEmail,
      ).toHaveBeenCalledWith(decodedPayload.id, user.email);
    });
  });

  describe('refresh', () => {
    it('should return user token DTO for valid refresh token', async () => {
      const user = { id: faker.number.int() };
      const refreshToken = faker.string.sample();

      const newJwtToken = faker.string.sample();
      const newRefreshToken = faker.string.sample();

      jest
        .spyOn(authCacheService, 'getUserIdByRefreshToken')
        .mockResolvedValueOnce(String(user.id));
      jest
        .spyOn(authCacheService, 'deleteRefreshToken')
        .mockResolvedValueOnce(null);
      jest
        .spyOn(authHelper, 'verifyRefreshToken')
        .mockResolvedValueOnce({ id: user.id });
      jest.spyOn(authHelper, 'generateTokenPair').mockResolvedValueOnce({
        jwtToken: newJwtToken,
        refreshToken: newRefreshToken,
      });

      const result = await authService.refresh(refreshToken);

      expect(result).toEqual({
        jwtToken: newJwtToken,
        refreshToken: newRefreshToken,
        user,
      });
      expect(authCacheService.getUserIdByRefreshToken).toHaveBeenCalledWith(
        refreshToken,
      );
      expect(authCacheService.deleteRefreshToken).toHaveBeenCalledWith(
        refreshToken,
      );
      expect(authHelper.verifyRefreshToken).toHaveBeenCalledWith(refreshToken);
      expect(authHelper.generateTokenPair).toHaveBeenCalledWith(user);
      expect(authCacheService.setRefreshToken).toHaveBeenCalledWith(
        newRefreshToken,
        user.id,
      );
    });

    it('should throw BadRequestException for invalid refresh token', async () => {
      const user = { id: faker.number.int() };
      const refreshToken = faker.string.sample();

      jest
        .spyOn(authCacheService, 'getUserIdByRefreshToken')
        .mockResolvedValueOnce(null);
      jest.spyOn(authHelper, 'verifyRefreshToken').mockResolvedValueOnce(null);
      jest
        .spyOn(userService, 'findUserById')
        .mockResolvedValueOnce(user as User);

      await expect(authService.refresh(refreshToken)).rejects.toThrowError(
        BadRequestException,
      );
      expect(authCacheService.getUserIdByRefreshToken).toHaveBeenCalledWith(
        refreshToken,
      );
      expect(authHelper.verifyRefreshToken).toHaveBeenCalledWith(refreshToken);
    });
  });
});
