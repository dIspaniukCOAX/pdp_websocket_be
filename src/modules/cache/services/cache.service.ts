import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';

@Injectable()
export class CacheService {
  constructor(@Inject(CACHE_MANAGER) private readonly cache: Cache) {}

  async get<T = string>(key): Promise<T> {
    return this.cache.get(key);
  }

  async set(key, value, options?: { ttl: number }): Promise<void> {
    await this.cache.set(key, value, options?.ttl);
  }

  async delete(key): Promise<void> {
    await this.cache.del(key);
  }
}
