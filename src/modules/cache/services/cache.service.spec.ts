import { faker } from '@faker-js/faker';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Test, TestingModule } from '@nestjs/testing';
import { Cache } from 'cache-manager';

import cacheManagerMockFactory from '../../../mocks/cache-manager.mock';
import { CacheService } from './cache.service';

describe('CacheService', () => {
  let cacheService: CacheService;
  let cacheManager: Cache;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        CacheService,
        {
          provide: CACHE_MANAGER,
          useFactory: cacheManagerMockFactory,
        },
      ],
    }).compile();

    cacheService = moduleRef.get<CacheService>(CacheService);
    cacheManager = moduleRef.get(CACHE_MANAGER);
  });

  it('CacheService - should be defined', () => {
    expect(cacheService).toBeDefined();
  });

  describe('get', () => {
    it('should call functions to get value from cache', async () => {
      const key = faker.lorem.word();

      await cacheService.get(key);

      expect(cacheManager.get).toBeCalledWith(key);
    });
  });

  describe('set', () => {
    it('should call functions to store value in cache', async () => {
      const key = faker.lorem.word();
      const value = faker.lorem.word();
      const options = { ttl: faker.number.int() };

      await cacheService.set(key, value, options);

      expect(cacheManager.set).toBeCalledWith(key, value, options.ttl);
    });
  });

  describe('delete', () => {
    it('should call functions to delete value from cache', async () => {
      const key = faker.lorem.word();

      await cacheService.delete(key);

      expect(cacheManager.del).toBeCalledWith(key);
    });
  });
});
