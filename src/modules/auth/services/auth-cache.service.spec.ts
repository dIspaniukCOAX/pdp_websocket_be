import { faker } from '@faker-js/faker';
import { Test, TestingModule } from '@nestjs/testing';

import {
  SECONDS_IN_24_HOURS,
  SECONDS_IN_30_DAYS,
} from '../../../constants/time.constant';
import cacheServiceMock from '../../../mocks/cache.service.mock';
import { CacheService } from '../../cache/services/cache.service';
import { AuthCacheService } from './auth-cache.service';

describe('AuthCacheService', () => {
  let authCacheService: AuthCacheService;
  let cacheService: CacheService;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [],
      providers: [
        AuthCacheService,
        {
          provide: CacheService,
          useFactory: cacheServiceMock,
        },
      ],
    }).compile();
    cacheService = moduleRef.get<CacheService>(CacheService);
    authCacheService = moduleRef.get<AuthCacheService>(AuthCacheService);
  });

  describe('deletePasswordRecoveryToken', () => {
    it('should call cacheService.delete with the correct key', async () => {
      const token = faker.string.sample();

      await authCacheService.deletePasswordRecoveryTokenFromCache(token);

      expect(cacheService.delete).toHaveBeenCalledWith(
        `forgot-password-token-${token}`,
      );
    });
  });

  describe('getUserIdByPasswordRecoveryToken', () => {
    it('should call cacheService.get with the correct key', async () => {
      const token = faker.string.sample();

      await authCacheService.getUserIdByPasswordRecoveryTokenFromCache(token);

      expect(cacheService.get).toHaveBeenCalledWith(
        `forgot-password-token-${token}`,
      );
    });

    it('should return userId from cacheService', async () => {
      const token = faker.string.sample();
      const userId = faker.number.int();

      jest.spyOn(cacheService, 'get').mockResolvedValueOnce(userId);

      const result =
        await authCacheService.getUserIdByPasswordRecoveryTokenFromCache(token);

      expect(result).toBe(userId);
    });
  });

  describe('setPasswordRecoveryToken', () => {
    it('should call cacheService.set with the correct key and userId', async () => {
      const token = faker.string.sample();
      const userId = faker.number.int();

      await authCacheService.setPasswordRecoveryTokenToCache(userId, token);

      expect(cacheService.set).toHaveBeenCalledWith(
        `forgot-password-token-${token}`,
        userId,
        { ttl: SECONDS_IN_24_HOURS },
      );
    });
  });

  describe('getRefreshToken', () => {
    it('should return correct user ID for existing refresh token', async () => {
      const refreshToken = faker.string.sample();

      jest.spyOn(cacheService, 'get').mockResolvedValueOnce(null);

      await authCacheService.getUserIdByRefreshToken(refreshToken);

      expect(cacheService.get).toHaveBeenCalledWith(`refresh-${refreshToken}`);
    });
  });

  describe('setRefreshToken', () => {
    it('should set refresh token with correct user ID', async () => {
      const refreshToken = faker.string.sample();
      const userId = faker.number.int();

      jest.spyOn(cacheService, 'set').mockResolvedValueOnce(null);

      await authCacheService.setRefreshToken(refreshToken, userId);

      expect(cacheService.set).toHaveBeenCalledWith(
        `refresh-${refreshToken}`,
        userId,
        { ttl: SECONDS_IN_30_DAYS },
      );
    });
  });

  describe('deleteRefreshToken', () => {
    it('should delete refresh token', async () => {
      const refreshToken = faker.string.sample();

      jest.spyOn(cacheService, 'delete').mockResolvedValueOnce(null);

      await authCacheService.deleteRefreshToken(refreshToken);

      expect(cacheService.delete).toHaveBeenCalledWith(
        `refresh-${refreshToken}`,
      );
    });
  });
});
